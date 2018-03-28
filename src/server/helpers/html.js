const renderFullPage = () => {
    return `<!doctype html>
        <html>
            <head>
                <title>My App</title>
                <meta charset="utf-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1">

                <title>URL Shortener</title>
                <link href='https://fonts.googleapis.com/css?family=Raleway' rel='stylesheet' type='text/css'>
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
            </head>
            <body>
                <div class="site-wrapper">

                    <div class="container">
                        <div class="inner">
                            <h1>URL Shortener</h1>

                            <div class="row">

                                <div class="col-lg-9">
                                    <form id="form-shorten" class="input-group input-group-lg">
                                        <input name="url" id="url-field" type="text" class="form-control" placeholder="Paste a link...">
                                        <span class="input-group-btn">
                                          <button id="btn-shorten" name="button" class="btn btn-shorten" type="submit">SHORTEN</button>
                                        </span>
                                    </form>
                                </div>
                            </div>

                            <h2>Short link:</h2>
                            <div class="col-lg-12">
                                <div id="link"></div>
                            </div>

                            <div id="error" class="text-danger"></div>


                        </div>
                    </div>

                </div>
                <script type="text/javascript" src="index.js"></script>
            </body>
        </html>`;
};

module.exports.renderHTML = renderFullPage;