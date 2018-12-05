function d3Reel() {

    let width = null,
        height = null,
        transition = null;

    function chart(selection) {
        selection.each(function (dataset) {
            const divBounds = selection[0][0].getBoundingClientRect();

            height = height || divBounds.height;
            width = width || divBounds.width;

            const disortionScale = d3.scale.linear()
                .domain([0, 100])
                .range([1, dataset.length + 3]);

            const x = d3.fisheye.ordinal()
                .domain(d3.range(dataset.length))
                .rangeRoundBands([0, width])
                .focus(width / 2)
                .distortion(disortionScale(dataset.length));

            const svg = selection.append("svg")
                .attr('id', '#reel-svg')
                .attr("width", width)
                .attr("height", height)
                .style('cursor', 'pointer')
                .style('-webkit-box-reflect', 'below 0px -webkit-linear-gradient(bottom, ' +
                    'rgba(255, 255, 255, 0.3) 0%, transparent 40%, transparent 100%)');

            const groups = svg
                .append("g")
                .selectAll('image')
                .data(dataset);

            const imageEnter = groups
                .enter()
                .append('image')
                .attr("xlink:href", function (d, i) {
                    return d.imageUrl;
                })
                .attr("y", 0)
                .attr("x", function (d, i) {
                    return x(i);
                })
                .attr("width", function (d, i) {
                    return Math.min(x.rangeBand(i), height);
                })
                .attr("height", function (d, i) {
                    return Math.min(x.rangeBand(i), height);
                })
                .style('transition', function () {
                    return transition ? `all ${transition}s` : null;
                });

            groups.exit().remove();

            imageEnter
                .on("mousemove", function () {
                    onMouseEnter(d3.mouse(this)[0]);
                });

            function onMouseEnter(xCoordinate) {
                x.focus(xCoordinate);
                imageEnter
                    .attr("x", function (d, i) {
                        return x(i);
                    })
                    .attr("width", function (d, i) {
                        return Math.min(x.rangeBand(i), height);
                    })
                    .attr("height", function (d, i) {
                        return Math.min(x.rangeBand(i), height);
                    });
            }
        });
    }

    chart.width = function (value) {
        if (!arguments.length) return width;
        width = value;
        return chart;
    };

    chart.height = function (value) {
        if (!arguments.length) return height;
        height = value;
        return chart;
    };

    chart.transition = function (value) {
        if (!arguments.length) return transition;
        transition = value;
        return chart;
    };

    return chart;
}

let images = [
    {imageUrl: 'images/kazan-cathedral.jpg'},
    {imageUrl: 'images/church.jpg'},
    {imageUrl: 'images/neva.jpg'},
    {imageUrl: 'images/peterhof.jpg'},
    {imageUrl: 'images/peterhof-1.jpg'},
    {imageUrl: 'images/saint-isaacs-cathedral.jpg'},
    {imageUrl: 'images/st-peter-and-paul.jpg'},
    {imageUrl: 'images/trinity-cathedral.jpg'},
    {imageUrl: 'images/kazan-cathedral.jpg'},
    {imageUrl: 'images/church.jpg'},
    {imageUrl: 'images/neva.jpg'},
    {imageUrl: 'images/peterhof.jpg'},
    {imageUrl: 'images/peterhof-1.jpg'},
    {imageUrl: 'images/saint-isaacs-cathedral.jpg'},
    {imageUrl: 'images/st-peter-and-paul.jpg'},
    {imageUrl: 'images/trinity-cathedral.jpg'},
    {imageUrl: 'images/kazan-cathedral.jpg'},
    {imageUrl: 'images/church.jpg'},
    {imageUrl: 'images/neva.jpg'},
    {imageUrl: 'images/peterhof.jpg'},
    {imageUrl: 'images/peterhof-1.jpg'},
    {imageUrl: 'images/saint-isaacs-cathedral.jpg'},
    {imageUrl: 'images/st-peter-and-paul.jpg'}
];

let chart = d3Reel();

d3.select("#reel-div")
    .datum(images)
    .call(chart);
