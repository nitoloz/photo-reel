function d3Reel() {
    function chart(selection) {
        selection.each(function (dataset) {
            const divBounds = selection[0][0].getBoundingClientRect();

            const disortionScale = d3.scale.linear()
                .domain([0, 100])
                .range([1, dataset.length + 3]);

            const x = d3.fisheye.ordinal()
                .domain(d3.range(dataset.length))
                .rangeRoundBands([0, divBounds.width])
                .focus(divBounds.width / 2)
                .distortion(disortionScale(dataset.length));

            const svg = selection.append("svg")
                .attr('id', '#reel-svg')
                .attr("width", divBounds.width)
                .attr("height", divBounds.height)
                .style('cursor', 'pointer')
                .style('-webkit-box-reflect', 'below 0px -webkit-linear-gradient(bottom, ' +
                    'rgba(255, 255, 255, 0.3) 0%, transparent 40%, transparent 100%)');

            const groups = svg
                .append("g")
                .selectAll('image')
                .data(dataset);

            const groupsEnter = groups
                .enter()
                .append('image');

            groups.exit().remove();

            const imageEnter = groupsEnter
                .attr("xlink:href", function (d, i) {
                    return d.imageUrl;
                })
                .attr("y", 0)
                .attr("x", function (d, i) {
                    return x(i);
                })
                .attr("width", function (d, i) {
                    return Math.min(x.rangeBand(i), divBounds.height);
                })
                .attr("height", function (d, i) {
                    return Math.min(x.rangeBand(i), divBounds.height);
                });

            groupsEnter
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
                        return Math.min(x.rangeBand(i), divBounds.height);
                    })
                    .attr("height", function (d, i) {
                        return Math.min(x.rangeBand(i), divBounds.height);
                    });
            }
        });
    }

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
