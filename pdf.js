//
// If absolute URL from the remote server is provided, configure the CORS
// header on that server.
//
const url = stateSrc.pdf

//
// In cases when the pdf.worker.js is located at the different folder than the
// PDF.js's one, or the PDF.js is executed via eval(), the workerSrc property
// shall be specified.
//
pdfjsLib.GlobalWorkerOptions.workerSrc =
  stateSrc.worker

let pdfDoc = null
const pageNum = 1
let pageRendering = false
let pageNumPending = null
const scale = 0.5
const canvas = document.getElementById('the-canvas')
const ctx = canvas.getContext('2d')

/**
 * Get page info from document, resize canvas accordingly, and render page.
 * @param num Page number.
 */
function renderPage (num) {
  pageRendering = true
  // Using promise to fetch the page
  pdfDoc.getPage(num).then(function (page) {
    const viewport = page.getViewport({ scale: scale })

    canvas.height = viewport.height
    canvas.width = viewport.width

    // Render PDF page into canvas context
    const renderContext = {
      canvasContext: ctx,
      viewport: viewport
    }
    const renderTask = page.render(renderContext)

    // Wait for rendering to finish
    renderTask.promise.then(function () {
      pageRendering = false
      if (pageNumPending !== null) {
        // New page rendering is pending
        renderPage(pageNumPending)
        pageNumPending = null
      }
    })
  })

  // Update page counters
  // document.getElementById('page_num').textContent = num;
}

/**
 * If another page rendering in progress, waits until the rendering is
 * finised. Otherwise, executes rendering immediately.
 */
function queueRenderPage (num) {
  if (pageRendering) {
    pageNumPending = num
  } else {
    renderPage(num)
  }
}

/**
 * Asynchronously downloads PDF.
 */
const loadingTask = pdfjsLib.getDocument(url)
loadingTask.promise.then(function (pdfDoc_) {
  pdfDoc = pdfDoc_
  // document.getElementById('page_count').textContent = pdfDoc.numPages;

  updateNumPages(pdfDoc_.numPages)
  // Initial/first page rendering
  renderPage(pageNum)
})
