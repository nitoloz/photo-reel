function d3Reel() {
    function chart(selection) {
        selection.each(function (dataset) {
            let divBounds = selection[0][0].getBoundingClientRect();

            let xScale = d3.scale.ordinal()
                .domain((d3.range(dataset.length)))
                .rangeRoundBands([0, divBounds.width]);

            let disortionScale = d3.scale.linear()
                .domain([0, 100])
                .range([5, 20]);

            let x = d3.fisheye.ordinal()
                .domain(d3.range(dataset.length))
                .rangeRoundBands([0, divBounds.width])
                .focus(1)
                .distortion(disortionScale(dataset.length));

            let svg = selection.append("svg")
                .attr('id','#reel-svg')
                .attr("width", divBounds.width)
                .attr("height", divBounds.height)
                .style('cursor', 'pointer')
                .style('-webkit-box-reflect', 'below 0px -webkit-linear-gradient(bottom, ' +
                    'rgba(255, 255, 255, 0.3) 0%, transparent 40%, transparent 100%)');

            let groups = svg
                .append("g")
                .selectAll('image')
                .data(dataset);

            let groupsEnter = groups
                .enter()
                .append('image');

            groups.exit().remove();

            let imageEnter = groupsEnter
                .attr("xlink:href", function (d, i) {
                    return d.imageUrl;
                })
                .attr("x", function (d, i) {
                    return xScale(i.toString());
                })
                .attr("y", 0)
                .attr("width", function (d, i) {
                    return Math.min(xScale.rangeBand(), divBounds.height);
                })
                .attr("height", function (d, i) {
                    return Math.min(xScale.rangeBand(), divBounds.height);
                })
                .style('transition', 'all 0.3s');

            groupsEnter
                .on("mousemove", function () {
                    onMouseEnter(d3.mouse(this)[0]);
                });

            onMouseEnter(divBounds.width / 2);

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
    {imageUrl: 'http://top10reiting.com/wp-content/uploads/2017/06/spas-na-krovi.jpg'},
    {imageUrl: 'http://nvdaily.ru/wp-content/uploads/2016/09/sankt-peterburg.jpg'},
    {imageUrl: 'http://www.rukivnogi.com/images/arts/74.jpg'},
    {imageUrl: 'https://dan-news.info/wp-content/uploads/2017/06/%D0%BF%D0%B0%D1%80%D1%83%D1%81%D0%B0-2.jpg'},
    {imageUrl: 'http://piter-otel.ru/photos/notes/12224.jpg'},
    {imageUrl: 'https://thumbs.dreamstime.com/b/peterhof-rusland-het-paleis-van-de-koning-en-fontein-grote-cascade-omgeving-van-st-petersburg-73465057.jpg'},
    {imageUrl: 'http://selfhacker.ru/wp-content/uploads/images/6918_0_f96b7abbd011e9ebfa4b19da40e3d210.jpg'},
    {imageUrl: 'http://piter.co/uploads/images/00/00/01/2013/10/12/54c90d1e92.jpg'},
    {imageUrl: 'http://top10reiting.com/wp-content/uploads/2017/06/spas-na-krovi.jpg'},
    {imageUrl: 'http://nvdaily.ru/wp-content/uploads/2016/09/sankt-peterburg.jpg'},
    {imageUrl: 'http://www.rukivnogi.com/images/arts/74.jpg'},
    {imageUrl: 'https://dan-news.info/wp-content/uploads/2017/06/%D0%BF%D0%B0%D1%80%D1%83%D1%81%D0%B0-2.jpg'},
    {imageUrl: 'http://piter-otel.ru/photos/notes/12224.jpg'},
    {imageUrl: 'https://thumbs.dreamstime.com/b/peterhof-rusland-het-paleis-van-de-koning-en-fontein-grote-cascade-omgeving-van-st-petersburg-73465057.jpg'},
    {imageUrl: 'http://selfhacker.ru/wp-content/uploads/images/6918_0_f96b7abbd011e9ebfa4b19da40e3d210.jpg'},
    {imageUrl: 'http://piter.co/uploads/images/00/00/01/2013/10/12/54c90d1e92.jpg'},
    {imageUrl: 'http://top10reiting.com/wp-content/uploads/2017/06/spas-na-krovi.jpg'},
    {imageUrl: 'http://nvdaily.ru/wp-content/uploads/2016/09/sankt-peterburg.jpg'},
    {imageUrl: 'http://www.rukivnogi.com/images/arts/74.jpg'},
    {imageUrl: 'https://dan-news.info/wp-content/uploads/2017/06/%D0%BF%D0%B0%D1%80%D1%83%D1%81%D0%B0-2.jpg'},
    {imageUrl: 'http://piter-otel.ru/photos/notes/12224.jpg'},
    {imageUrl: 'https://thumbs.dreamstime.com/b/peterhof-rusland-het-paleis-van-de-koning-en-fontein-grote-cascade-omgeving-van-st-petersburg-73465057.jpg'},
    {imageUrl: 'http://selfhacker.ru/wp-content/uploads/images/6918_0_f96b7abbd011e9ebfa4b19da40e3d210.jpg'},
    {imageUrl: 'http://piter.co/uploads/images/00/00/01/2013/10/12/54c90d1e92.jpg'}
];

let chart = d3Reel();

d3.select("#reel-div")
    .datum(images)
    .call(chart);
