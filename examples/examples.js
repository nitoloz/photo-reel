let images = [
    {imageUrl: 'examples/images/kazan-cathedral.jpg'},
    {imageUrl: 'examples/images/church.jpg'},
    {imageUrl: 'examples/images/neva.jpg'},
    {imageUrl: 'examples/images/peterhof.jpg'},
    {imageUrl: 'examples/images/peterhof-1.jpg'},
    {imageUrl: 'examples/images/saint-isaacs-cathedral.jpg'},
    {imageUrl: 'examples/images/st-peter-and-paul.jpg'},
    {imageUrl: 'examples/images/trinity-cathedral.jpg'},
    {imageUrl: 'examples/images/kazan-cathedral.jpg'},
    {imageUrl: 'examples/images/church.jpg'},
    {imageUrl: 'examples/images/neva.jpg'},
    {imageUrl: 'examples/images/peterhof.jpg'},
    {imageUrl: 'examples/images/peterhof-1.jpg'},
    {imageUrl: 'examples/images/saint-isaacs-cathedral.jpg'},
    {imageUrl: 'examples/images/st-peter-and-paul.jpg'},
    {imageUrl: 'examples/images/trinity-cathedral.jpg'},
    {imageUrl: 'examples/images/kazan-cathedral.jpg'},
    {imageUrl: 'examples/images/church.jpg'},
    {imageUrl: 'examples/images/neva.jpg'},
    {imageUrl: 'examples/images/peterhof.jpg'},
    {imageUrl: 'examples/images/peterhof-1.jpg'},
    {imageUrl: 'examples/images/saint-isaacs-cathedral.jpg'},
    {imageUrl: 'examples/images/st-peter-and-paul.jpg'}
];

let defaultPhotoReel = d3PhotoReel();

d3.select("#full-width-reel-div")
    .datum(images)
    .call(defaultPhotoReel);