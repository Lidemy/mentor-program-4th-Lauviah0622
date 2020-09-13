const formTemplate = `
        <div class="p-3">
            <section class="pt-3 pb-3">
                <div class="form-group row">
                    <label for="nickname" class="col-md-3">nickname</label>
                    <input class="nickname form-control form-control-sm col-md-8" type="text" placeholder="nickname">
                </div>
                <div class="form-group">
                    <label for="exampleFormControlTextarea1">content</label>
                    <textarea class="form-control content rows="3"></textarea>
                </div>
                <button  class="submit btn btn-primary">Submit</button>
            </section>
            <section class="row pt-3 pb-3 posts">
            </section>
            <div class="d-flex justify-content-center align-items-center col-12 h-25 mb-5">
                <div class="spinner-border loading" role="status"style="display: none;">
                    <span class="sr-only">Loading...</span>
                </div>
            </div>
            <button type="button" class="btn btn-primary btn-md btn-block mb-5 more" style="display: none;">顯示更多</button>
        </div>
        `;

function createCardHtml (nickname, content, created_at) {
    return `<div class="col-12 col-md-6 col-xl-4 mt-1">
                <div class="card">
                    <div class="card-header p-2">
                        ${nickname}
                    </div>
                    <div class="card-body p-2">
                        <p class="card-text">${content}</p>
                        <p class="card-text"><small class="text-muted">${created_at}</small></p>
                    </div>
                </div>
            </div>
            `
}

export {formTemplate, createCardHtml};