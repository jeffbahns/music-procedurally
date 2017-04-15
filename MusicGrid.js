var MusicGrid = function() {
    /** grid size **/
    var squareWidth = 40,
        squareHeight = 40,
        gridCols = 8,
        gridRows = 8,
        squarePadding = 0,
        svgSize = svgSizeUpdate(); // assuming the grid is a square.

    /** Matrix variables **/
    var matrixData = [];

    /** Grid SVG that holds each square **/
    var gridSVG = d3.select("#grid").append("svg")
        .attr("class", "svgGrid")
        .attr("width", svgSize + "px")
        .attr("height", svgSize + "px");


    /** Initalizer **/
    MusicGrid.drawGrid = function() {
        gridSVG.attr("width", svgSize + "px")
            .attr("height", svgSize + "px");

        var data = gridData();
        console.log(data);
        var row = gridSVG.selectAll(".row")
            .data(data)
            .enter().append("g")
            .attr("class", "row");

        var column = row.selectAll(".square")
            .data(function(d) {
                return d;
            })
            .enter().append("rect")
            .attr("class", "square")
            .attr("x", function(d) {
                return d.x;
            })
            .attr("y", function(d) {
                return d.y;
            })
            .attr("width", function(d) {
                return d.width;
            })
            .attr("height", function(d) {
                return d.height;
            })
            .style("fill", "white")
            .style("stroke", "#222");

        return MusicGrid;
    };

    /**
     * Update function
     * input: array of points that are in the grid i.e. [ [row,col], [row,col], [row,col] ]
     **/
    MusicGrid.update = function(x) {
        if (!arguments.length) return matrixData;
        matrixData = [];
        matrixUpdate();
        for (var i in x) {
            matrixData.push(node(x[i][0], x[i][1]));
        }
        matrixUpdate();
        return MusicGrid;
    };

    /** Getter/Setter Functions **/
    MusicGrid.height = function(x) {
        if (!arguments.length) return squareHeight;
        squareHeight = x;
        svgSize = svgSizeUpdate();
        return MusicGrid;
    };

    MusicGrid.width = function(x) {
        if (!arguments.length) return squareWidth;
        squareWidth = x;
        svgSize = svgSizeUpdate();
        return MusicGrid;
    };

    MusicGrid.rows = function(x) {
        if (!arguments.length) return gridRows;
        gridRows = x;
        svgSize = svgSizeUpdate();
        return MusicGrid;
    };

    MusicGrid.columns = function(x) {
        if (!arguments.length) return gridCols;
        gridCols = x;
        svgSize = svgSizeUpdate();
        return MusicGrid;
    };



    /** Internally used functions to set up pieces of the class **/
    function node(row, col) {
        var width = squareWidth - 1;
        var height = squareHeight - 1;
        var ypos = row * (width + squarePadding + 1) + 1.5;
        var xpos = col * (height + squarePadding + 1) + 1.5;
        return {
            x: xpos,
            y: ypos,
            width: width,
            height: height,
            opacity: 1
        };
    }

    function matrixUpdate() {
        var rect = gridSVG.selectAll(".mat_square")
            .data(matrixData);

        rect.enter().append("rect")
            .attr("class", "mat_square")
            .attr("x", function(d) {
                return d.x;
            })
            .attr("y", function(d) {
                return d.y;
            })
            .attr("width", function(d) {
                return d.width;
            })
            .attr("height", function(d) {
                return d.height;
            })
            .style("opacity", 0)
            .style("fill", "red");

        rect.transition()
            .style("opacity", function(d) {
                return d.opacity;
            });

        rect.exit().transition()
            .style("opacity", 1e-6)
            .remove();
    }

    function gridData() {
        var data = [];
        var xpos = 1; //starting xpos and ypos at 1 so the stroke will show when we make the grid below
        var ypos = 1;
        var width = squareWidth;
        var height = squareHeight;

        // iterate for rows
        for (var row = 0; row < gridRows; row++) {
            data.push([]);

            // iterate for cells/columns inside rows
            for (var column = 0; column < gridCols; column++) {
                data[row].push({
                    x: xpos,
                    y: ypos,
                    width: width,
                    height: height
                });
                // increment the x position. I.e. move it over by 50 (width variable)
                xpos += width + squarePadding;
            }
            // reset the x position after a row is complete
            xpos = 1;
            // increment the y position for the next row. Move it down 50 (height variable)
            ypos += height + squarePadding;
        }
        return data;
    }

    function svgSizeUpdate() {
        return (squareWidth + squarePadding) * gridRows + 2;
    }

    return MusicGrid;
};