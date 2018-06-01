(function () {
    d3.fisheye = {
        scale: function (scaleType) {
            return d3_fisheye_scale(scaleType(), 3, 0);
        },
        ordinal: function () {
            return d3_fisheye_scale_ordinal(d3.scale.ordinal(), 3, 0);
        },
        circular: function () {
            let radius = 200, distortion = 5, k0, k1, focus = [0, 0];

            function fisheye(d) {
                let dx = d.x - focus[0], dy = d.y - focus[1], dd = Math.sqrt(dx * dx + dy * dy);
                if (!dd || dd >= radius)
                    return {x: d.x, y: d.y, z: 1};
                let k = k0 * (1 - Math.exp(-dd * k1)) / dd * .75 + .25;
                return {x: focus[0] + dx * k, y: focus[1] + dy * k, z: Math.min(k, 10)};
            }

            function rescale() {
                k0 = Math.exp(distortion);
                k0 = k0 / (k0 - 1) * radius;
                k1 = distortion / radius;
                return fisheye;
            }

            fisheye.radius = function (_) {
                if (!arguments.length)
                    return radius;
                radius = +_;
                return rescale();
            };
            fisheye.distortion = function (_) {
                if (!arguments.length)
                    return distortion;
                distortion = +_;
                return rescale();
            };
            fisheye.focus = function (_) {
                if (!arguments.length)
                    return focus;
                focus = _;
                return fisheye;
            };
            return rescale();
        }
    };

    function d3_fisheye_scale(scale, d, a) {
        function fisheye(_) {
            let x = scale(_), left = x < a, range = d3.extent(scale.range()), min = range[0], max = range[1],
                m = left ? a - min : max - a;
            if (m == 0)
                m = max - min;
            return (left ? -1 : 1) * m * (d + 1) / (d + (m / Math.abs(x - a))) + a;
        }

        fisheye.distortion = function (_) {
            if (!arguments.length)
                return d;
            d = +_;
            return fisheye;
        };
        fisheye.focus = function (_) {
            if (!arguments.length)
                return a;
            a = +_;
            return fisheye;
        };
        fisheye.copy = function () {
            return d3_fisheye_scale(scale.copy(), d, a);
        };
        fisheye.nice = scale.nice;
        fisheye.ticks = scale.ticks;
        fisheye.tickFormat = scale.tickFormat;
        return d3.rebind(fisheye, scale, "domain", "range");
    }

    function d3_fisheye_scale_ordinal(scale, d, a) {
        function scale_factor(x) {
            let left = x < a, range = scale.rangeExtent(), min = range[0], max = range[1], m = left ? a - min : max - a;
            if (m == 0)
                m = max - min;
            let factor = (left ? -1 : 1) * m * (d + 1) / (d + (m / Math.abs(x - a)));
            return factor + a;
        }

        function fisheye(_) {
            return scale_factor(scale(_));
        }

        fisheye.distortion = function (_) {
            if (!arguments.length)
                return d;
            d = +_;
            return fisheye;
        };
        fisheye.focus = function (_) {
            if (!arguments.length)
                return a;
            a = +_;
            return fisheye;
        };
        fisheye.copy = function () {
            return d3_fisheye_scale_ordinal(scale.copy(), d, a);
        };
        fisheye.rangeBand = function (_) {
            let band = scale.rangeBand(), x = scale(_), x1 = scale_factor(x), x2 = scale_factor(x + band);
            return Math.abs(x2 - x1);
        };
        fisheye.rangeRoundBands = function (x, padding, outerPadding) {
            let roundBands = arguments.length === 3 ? scale.rangeRoundBands(x, padding, outerPadding) : arguments.length === 2 ? scale.rangeRoundBands(x, padding) : scale.rangeRoundBands(x);
            fisheye.padding = padding * scale.rangeBand();
            fisheye.outerPadding = outerPadding;
            return fisheye;
        };
        return d3.rebind(fisheye, scale, "domain", "rangeExtent", "range");
    }
})();

let D3Reel = (function () {
    function D3Reel() {
        // this.config = config;
    }

    D3Reel.prototype.draw = function (data) {
        let that = this;
        let divBounds = (d3.select("#reel-div")[0][0]).getBoundingClientRect();
        let onMouseEnter = function (xCoordinate) {
            x.focus(xCoordinate);
            rectEnter
                .attr("x", function (d, i) {
                    return x(i);
                })
                .attr("width", function (d, i) {
                    return x.rangeBand(i);
                });
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
        };
        // let w = 900;
        // let h = 150;
        let dataset = data;
        let xScale = d3.scale.ordinal()
            .domain((d3.range(dataset.length)))
            .rangeRoundBands([0, divBounds.width]);
        let disortionScale = d3.scale.linear()
            .domain([0, 100])
            .range([5, 20]);
        let x = d3.fisheye.ordinal()
            .domain(d3.range(dataset.length))
            .rangeRoundBands([0, divBounds.width]).focus(1).distortion(disortionScale(dataset.length));
        // let x = d3.fisheye.scale(d3.scale.identity).domain([0, dataset.length]).focus(360);
        //Create SVG element
        let svg = d3.select("#reel-svg")
        // .append("svg")
            .attr("width", divBounds.width)
            .attr("height", divBounds.height)
            .style('cursor', 'pointer')
            .style('-webkit-box-reflect', 'below 0px -webkit-linear-gradient(bottom, rgba(255, 255, 255, 0.3) 0%, transparent 40%, transparent 100%)');
        //Create elements
        let groups = svg.selectAll("rect")
            .data(dataset);
        let groupsEnter = groups
            .enter()
            .append("g");
        let rectEnter = groupsEnter.append("rect")
            .attr("x", function (d, i) {
                return xScale(i.toString());
            })
            .attr("y", function (d) {
                return 0;
            })
            .attr("width", function (d, i) {
                return xScale.rangeBand();
            })
            .attr("height", function (d) {
                return divBounds.height;
            })
            .attr("fill", function (d) {
                return 'white';
            })
            .attr("stroke", function (d) {
                return 'none';
            })
            .style('transition', 'all 0.3s');
        // let textEnter = groupsEnter
        //   .append('text')
        //   .attr("x", function (d, i) {
        //     return xScale(i.toString());
        //   })
        //   .attr("y", divBounds.height / 2)
        //   .attr("dy", ".35em")
        //   .text(function (d) {
        //     return 'Some new text';
        //   });
        let imageEnter = groupsEnter
            .append('image')
            .attr("xlink:href", function (d, i) {
                return d.imageUrl;
                // return 'https://i.stack.imgur.com/ZFzYt.png';
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
        onMouseEnter(divBounds.width / 2);
        groupsEnter.on("mousemove", function () {
            let mouse = d3.mouse(this);
            onMouseEnter(mouse[0]);
            // textEnter
            //   .attr("x", function (d, i) {
            //     return x(i);
            //   });
        })
            .on("mouseout", function () {
                // rectEnter
                //   .attr("x", function (d, i) {
                //     return xScale(i.toString());
                //   })
                //   .attr("width", function (d, i) {
                //     return xScale.rangeBand();
                //   });
                // imageEnter
                //   .attr("x", function (d, i) {
                //     return xScale(i.toString());
                //   })
                //   .attr("width", function (d, i) {
                //     return Math.min(xScale.rangeBand(), divBounds.height);
                //   })
                //   .attr("height", function (d, i) {
                //     return Math.min(xScale.rangeBand(), divBounds.height);
                //   });
                // textEnter
                //   .attr("x", function (d, i) {
                //     return xScale(i.toString());
                //   });
            })
            .on("click", function (d, i) {
                console.log('SELECTED:' + d.imageUrl);
            });
        groups.exit()
            .remove();
    };
    (new D3Reel()).draw([
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
        ]);

    return D3Reel;
}());
// exports.D3Reel = D3Reel;
