function showPerformance(interGraph) {
    var graph20Nodes = interGraph;
    var sameSizeTimes = 100;
    var randomSizeTimes = 100;
    var groups, flag, groupStartNum = 1, info;
    var tempRoot, algoResult, showData = [], i, len, leaf;
    var meanMethod = "geometric";

    // function updateMeanMethod() {
    //     var e = document.getElementById("meanChoice").selected;
    //     meanMethod = e.options[e.selectedIndex].value;
    // }
    function getGraphFromIndexArray(indexArray, isAlgo) {
        if (isAlgo) {
            info = "<p>Algorithm grouping the graph into: <mark> " + indexArray.length + "</mark> groups.</p>";
            info += "<p>Each group's homogeneity inforamtion are:</p><hr>";
        }
        var j, len1, len2, result, textArray, tempGraph, homoInfo, intensInfo;
        // homoInfo = [];
        // intensInfo = [];
        var marked = false;
        for (i = 0, len1 = indexArray.length; i < len1; i += 1) {
            len2 = indexArray[i].length;
            textArray = [];
            for (j = 0; j < len2; j += 1) {
                textArray.push(indexArray[i][j]);
            }
            tempGraph = getSubInterGraph(textArray, interGraph);
            if (tempGraph.sizeOfMatrix != indexArray[i].length && !isAlgo) {
                marked = true;
            } else {
                result = getEntangleProperty(tempGraph);
                homoInfo += result.homogeneity;
                intensInfo += result.intensity;
                // homoInfo.push(result.homogeneity);
                // intensInfo.push(result.intensity);
            }
            if (isAlgo) {
                info += "<p>Group " + (i + 1) + " with <mark class='markedQuery'>" + j + "</mark> terms " +": </p>";
                info += "<p>The " + meanMethod + " of homogeneity: <mark>" + result.homogeneity.toFixed(5) + "</mark></p>";
                info += "<p>The " + meanMethod + " of intensity: <mark>" + result.intensity.toFixed(5) + "</mark></p><hr>";
            }
        }
        homoInfo /= len1;
        intensInfo /= len1;
        if (isAlgo) {
            algoResult.push(homoInfo);
            algoResult.push(intensInfo);
            info += "<p>The " + meanMethod + " mean of homogeneity is: <mark class='markedQuery'>" + homoInfo.toFixed(5) + "</mark></p>";
            info += "<p>The " + meanMethod + " mean of intensity is: <mark class='markedQuery'>" + intensInfo.toFixed(5) + "</mark></p>";
            d3.select("#testInfo").html(info);
        }
        if (!isAlgo && !marked) {
            showData.push([homoInfo, intensInfo]);
        }
    }
    function getGroupResults(groupsNum) {
        groups = [];
        flag = 0;
        for (i = 0; i < groupsNum; i += 1) {
            var tempArray = [];
            groups.push(tempArray);
        }
        makeGroup.groupTheGraph(graph20Nodes, groupsNum);
        for (tempRoot in graph20Nodes.termsGroup) {
            groups[flag].push(tempRoot);
            for (i = 0, len = graph20Nodes.termsGroup[tempRoot].length; i < len; i += 1) {
                leaf = graph20Nodes.termsGroup[tempRoot][i];
                groups[flag].push(leaf);
            }
            flag += 1;
        }
    }

    var widthC = 800, heightC = 600, padding = 50;
    var svg = d3.select("#reCord").append("svg")
                .attr("width", widthC + padding)
                .attr("height", heightC + padding);
    var xScale = d3.scale.linear()
                    .domain([0,1])
                    .range([0,widthC-padding]);
    var yScale = d3.scale.linear()
                    .domain([0,1])
                    .range([heightC - padding,0]);
    var xAxis = d3.svg.axis()
                        .scale(xScale)
                        .orient("bottom")
                        .ticks(20);
    var yAxis = d3.svg.axis()
                        .scale(yScale)
                        .orient("left")
                        .ticks(20);
    var aX = svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(50,600)")
        .call(xAxis);
    aX.append("text")
        .text("homogeneity")
        .attr("class", "liW")
        .attr("transform", "translate(-30, -570)")
        .attr("text-anchor", "start")
        .style("font-size", "12px")
        .style("fill", "black");
    var aY = svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(50,50)")
        .call(yAxis);

    aX.append("text")
        .text("intensity")
        .attr("class", "liW")
        .attr("transform", "translate(700, 36)")
        .attr("text-anchor", "start")
        .style("font-size", "12px")
        .style("fill", "black");
    // var ranN = svg.append("g");

    function getRandomTermsIndex(groupsNumArray, isRandom) {
        var result = [], index, len3, len4, index2, tempLen, randomSize, pickLen;
        var pickArray = [], pickNum, miniGSize;
        for (index = 0; index < 20; index += 1) {
            pickArray.push(index);
        }
        for (index = 0, len3 = groupsNumArray.length; index < len3; index += 1) {
            var tempArray = [];
            result.push(tempArray);
        }
        if (!isRandom) {
            for (index = 0; index < len3; index += 1) {
                len4 = groupsNumArray[index].length;
                for (index2 = 0; index2 < len4; index2 += 1) {
                    tempLen = pickArray.length;
                    pickNum = pickArray.splice(Math.floor(Math.random() * tempLen), 1)[0];
                    result[index].push(pickNum);
                }
            }
        } else {
            if (len3 > 3) {
                miniGSize = 2;
            } else {
                miniGSize = 3;
            }
            for (index = 0; index < len3 - 1; index += 1) {
                tempLen = pickArray.length - (len3 - index) * miniGSize;
                randomSize = Math.floor(Math.random() * tempLen + miniGSize); 
                for (index2 = 0; index2 < randomSize; index2 += 1) {
                    pickLen = pickArray.length;
                    pickNum = pickArray.splice(Math.floor(Math.random() * pickLen), 1)[0];
                    result[index].push(pickNum);
                }
            }
            result[len3-1] = pickArray;
        }
        return result;
    } 
    
    d3.select("#addCaller")
        .on("click", function() {
            if (groupStartNum <= 6) {
                groupStartNum += 1;
                updateNodes(groupStartNum);
            }
        });
    
    d3.select("#recCaller")
        .on("click", function() {
            if (groupStartNum > 2) {
                groupStartNum -= 1;
                updateNodes(groupStartNum);
            }
        });
    d3.select("#ranCaller")
        .on("click", function() {
            if (showData.length == 0) {
                return;
            }
            addDiffSizeGroups();
            updateShowNodes();
        })

    function addAlgoRes(groupsNums) {
        algoResult = [];
        getGroupResults(groupsNums);
        getGraphFromIndexArray(groups, true);
        svg.append("g")
            .append("circle")
            .attr("cx", xScale(algoResult[1]))
            .attr("cy", yScale(algoResult[0]))
            .attr("r", "5px")
            .attr("transform", "translate(50,50)")
            .style("fill", "#F08080");
    }
    function addSameSizeGroups() {
        for (var k = 0; k < sameSizeTimes; k += 1) {
            getGraphFromIndexArray(getRandomTermsIndex(groups));
        }
    }
    function addDiffSizeGroups() {
        for (var k = 0; k < randomSizeTimes; k += 1) {
            getGraphFromIndexArray(getRandomTermsIndex(groups, true));
        }
    }
    function updateNodes(startNums) {
        // updateMeanMethod();
        showData = [];
        svg.selectAll("circle").remove();
        addAlgoRes(startNums);
        addSameSizeGroups();
        updateShowNodes();
    }
    function updateShowNodes() {
        svg.selectAll(".circle")
            .data(showData)
            .enter()
            .append("circle")
            .attr("class", "circle")
            .attr("r", 3)
            .attr("transform", "translate(50,50)")
            .attr("cx", function(d) { return xScale(d[1]); })
            .attr("cy", function(d) { return yScale(d[0]); });
    } 
}

(function() {

    var nlpTags = {
        "VB" : "verb",
        "VBD" : "verb",
        "VBN" : "verb",
        "VBP" : "verb",
        "VBZ" : "verb",
        "VBF" : "verb",
        "CP" : "verb",
        "VBG" : "verb",
        "JJ" : "adjective",
        "JJR" : "adjective",
        "JJS" : "adjective",
        "RB" :   "adverb",
        "RBR" :   "adverb",
        "RBS" :   "adverb",
        "NN" : "noun",
        "NNP" : "noun",
        "NNPA" : "noun",
        "NNAB" : "noun",
        "NNPS" : "noun",
        "NNS" : "noun",
        "NNO" : "noun",
        "NG" : "noun",
        "PRP" : "noun",
        "PP" : "noun",
        "FW" : "glue",
        "IN" : "glue",
        "MD" : "glue",
        "CC" : "glue",
        "DT" : "glue",
        "UH" : "glue",
        "EX" : "glue",
        "CD" : "value",
        "DA" : "value",
        "NU" : "value",
    }
    var nlpPara = {
        isChecked : false,
        checkedItems : [0, 2],
    }
    var paraBB = {
        paraTag : "bpp",
        graphPara : {
            tagId : "bppgp",
            nlpParas : {
                isChecked : false,
                checkedItems : [0, 2],
            },
            formTagName : "bcw",
            submitTag : "wws4",
            scale : "log",
            maxBubbleNum : 80, 
        },
        groupPara : {
            tagId : "bppgo",
            formTagName : "gppb",
            submitTag : "gfcb",
            isFilterGroup : true,
            groupNum : 10,
            isUpdate : true,
        },
        biggestSize : 46,
        smallSize : 20,
    };
    var paraHM = {
        paraTag : "mpp",
        graphPara : {
            tagId : "mppgp",
            nlpParas : {
                isChecked : false,
                checkedItems : [0, 2],
            },
            formTagName : "pcw",
            submitTag : "wws3",
            maxMatrixSize : 50,
        },
        groupPara : {
            tagId : "mppgo",
            formTagName : "gmp",
            submitTag : "gfcm",
            groupNum : 0
        },
        biggestSize : 0,
        smallSize : 0,
    };

    var paraFN = {
        paraTag : "spp",
        graphPara : {
            tagId : "sppgp",
            nlpParas : {
                isChecked : false,
                checkedItems : [0, 2],
            },
            formTagName : "nfw",
            submitTag : "wws2",
            scale : "log",
            maxNodesNum : 20,
            nodesDist : 200,
        },
        groupPara : {
            tagId : "sppgo",
            isGroupColor : true,
            isGroupFilter : true,
            formTagName : "gfp",
            submitTag : "gfcn",
            groupNum : 4,
        },
        biggestSize : 14,
        smallSize : 3,
    };

    var paraTH = {
        paraTag : "tpp",
        graphPara : {
            tagId : "tppg",
            nlpParas : {
                isChecked : false,
                checkedItems : [0, 2],
            },
            formTagName : "tfw",
            submitTag : "wws1",
            scale : "log",
            angle : 0,
            maxTagsNum : 100,
        },
        groupPara : {
            tagId : "tppgo",
            isGroupColor : false,
            isGroupFilter : false,
            formTagName : "gppw",
            groupNum : 2,
            submitTag : "gfcw",
        },
        biggestSize : 50,
        smallSize : 20,
        isHeatView : false,
        isListView : false,
    };

    var paraDG = {
        paraTag : "dpp",
        graphPara : {
            tagId : "dppgp",
            nlpParas : {
                isChecked : false,
                checkedItems : [0, 2],
            },
            formTagName : "dcw",
            submitTag : "wws5",
        }
    };
    
    function getTermIndex(termText, inGraph) {
        var re = -1;
        var len = inGraph.sizeOfMatrix;
        for (var temp1 = 0; temp1 < len; temp1 += 1) {
            if (termText === inGraph.nodes[temp1].text) {
                re = temp1;
                break;
            }
        }
        return re;
    }

    function testNeighbour(a, b, inGraph) {
        var i1, i2;
        if (typeof a == "number") {
            if (i1 >= inGraph.sizeOfMatrix || i2 >= inGraph.sizeOfMatrix) {
                return false;
            }
            i1 = a;
            i2 = b;
        } else {
            i1 = getTermIndex(a, inGraph);
            i2 = getTermIndex(b, inGraph);
            if (i1 == -1 || i2 == -1) {
                return false;
            }
        }
        return inGraph.matrix[i1][i2] != 0;
    }

    function cloudLayout(pointer) {
        var wordDict = pointer.myData;
        var clickedOrder,
            i, len, cOrder, tempText,
            index, optiSize,
            subInterGraph = "undefined",
            fill = d3.scale.category20b(),
            groupFill = d3.scale.category10(),//color for group coloring
            width = parseInt((wordDict.sizeOfMatrix/300) * 800 + 650),
            height = width - 400,
            middleX = parseInt(width / 2)-20,
            middleY = parseInt(height / 2 + 10);

        // windowProperty.optimiseWinSize(width);
        wordCluster.dendrogramPosition(width, height, wordDict);
        
        //color scale for words list
        var colorForOrder = ["#6363FF", "#6373FF", "#63A3FF", "#63E3FF", "#63FFFB", "#63FFCB",
                   "#63FF9B", "#63FF6B", "#7BFF63", "#BBFF63", "#DBFF63", "#FBFF63", 
                   "#FFD363", "#FFB363", "#FF8363", "#FF7363", "#FF6364"];
        var colorForHeatWord = ["#5254a3","6b6eff","#8c6d31","#843c39","#7b4173",
                            "#0847BF","#0864BF","#5708BF","#9E08BF","#BF084D"];
        var heatWords = d3.scale.quantile()
                            .domain([0, 20])
                            .range(colorForHeatWord);            

        var svg = d3.select("#gwi").append("svg")
                .attr("width", width)
                .attr("height", height);
        var heatMap = svg.append("g").attr("id", "heatMapBack");

        var wordPane = svg.append("g")
                        .attr("transform", "translate("
                            + middleX + ", " + middleY + ")");

        var heatData = [];
        var heatCell = 6;
        var heatColorScale = ["#F01305","#F02F05","#F03805","#F04D05","#F05005","#F06B05","#F08A05","#F09405","#F0A205",
                            "#F0B505","#F0C405","#F0D705","#F0E805","#EFF005","#E4F005","#D9F005","#D1F005","#C3F005",
                            "#BAF005", "#ABE500","#95E500","#7DE500","#55E500","#11E500","#00E56B","#00E5AC","#00E0E5","#00CDE5"];
        var colorHeat = d3.scale.quantile()
                            .domain([0, 20])
                            .range(heatColorScale.reverse());

        function updateHeatData() {
            var perColon, rightBorder = downBorder = 0;
            var leftBorder = upBorder = 400;
            var heatDict = {}, tempCellID, oneTerm, x0, x1, y0, y1, cx, cy, tempValue, k, coreHeat;
            // getNodesDegree(wordDict);
            for (i = 0; i < wordDict.sizeOfMatrix; i += 1) {
                oneTerm = wordDict.nodes[i];
                cx = oneTerm.x + middleX;
                cy = oneTerm.y + middleY;
                x0 = cx - oneTerm.width/3;
                x1 = cx + oneTerm.width/3;
                y0 = cy - oneTerm.height/3 - 3;
                y1 = cy + 3;
                leftBorder = leftBorder > x0? x0 : leftBorder;
                rightBorder = rightBorder > x1 ? rightBorder : x1;
                upBorder = upBorder > y0 ? y0 : upBorder;
                downBorder = downBorder > y1 ? downBorder : y1;
                x0 = parseInt(x0 / heatCell);
                x1 = parseInt(x1 / heatCell);
                y0 = parseInt(y0 / heatCell);
                y1 = parseInt(y1 / heatCell);
                for (cx = x0 - 3; cx <= x1 + 3; cx += 1) {
                    for (cy = y0 - 3; cy <= y1 + 3; cy += 1) {
                        tempCellID = cx + "-" + cy;
                        var tempIndex2 = oneTerm.termIndex > 20 ? 20 : oneTerm.termIndex;
                        coreHeat = (tempIndex2 / 20) * 19 + 1;
                        if ((cx==x0-3 || cx==x1+3) && (cy<y0-1 || cy>y1+1)) continue;
                        if ((cx==x0-2 || cx==x1+2) && (cy<y0-2 || cy>y1+2)) continue;
                        if (((cx==x0-1 || cx==x1+1) && (cy>y0-2 && cy<y1+2))
                            || ((cy==y0-1 || cy==y1+1) && (cx>x0-2 && cx<x1+2))) {
                            coreHeat -= 3;
                        } else if (((cx==x0-2 || cx==x1+2) && (cy>y0-3 && cy<y1+3))
                            || ((cy==y0-2 || cy==y1+2) && (cx>x0-3 && cx<x1+3))) {
                            coreHeat -= 6;
                        } else if (((cx==x0-3 || cx==x1+3) && (cy>y0-2 && cy<y1+2))
                            || ((cy==y0-3 || cy==y1+3) && (cx>x0-2 && cx<x1+3))) {
                            coreHeat -= 9;
                        }
                        if (heatDict.hasOwnProperty(tempCellID)) {
                            if (heatDict[tempCellID] < coreHeat) {
                                heatDict[tempCellID] = coreHeat;
                            }
                        } else {
                            heatDict[tempCellID] = coreHeat;
                        }
                    }
                }
            }
            perColon = parseInt(rightBorder / heatCell) + 4;
            perRow = parseInt(downBorder / heatCell) + 4;
            for (i = parseInt(leftBorder / heatCell)-3; i < perColon; i += 1) {
                for (j = parseInt(upBorder / heatCell)-3; j < perRow; j += 1) {
                    tempCellID = i + "-" + j;
                    cx = i * heatCell;
                    cy = j * heatCell;
                    tempCellID = i + "-" + j;
                    if (heatDict.hasOwnProperty(tempCellID)) {
                        tempValue = heatDict[tempCellID];
                        heatData.push({x:cx, y: cy, value: tempValue});
                    }
                }
            }
        }

        function giveHeat() {
            updateHeatData();
            heatMap.selectAll(".htCell")
                    .data(heatData)
                    .enter().append("rect")
                    .attr("class", "htCell")
                    .attr("width", heatCell )
                    .attr("height", heatCell )
                    .attr("x", function(d) {
                        return d.x;
                    })
                    .attr("y", function(d) {
                        return d.y;
                    })
                    .attr("fill", colorHeat(0))
                    .style("opacity", 0.5);
            var startX = width - 30,
                startY = 400;
            heatMap.selectAll(".htIndex")
                    .data(heatColorScale)
                    .enter().append("rect")
                    .attr("class", "htIndex")
                    .attr("width", 20)
                    .attr("height", 12)
                    .attr("x", startX)
                    .attr("y", function(d, i) {
                        return startY - i * 12;
                    })
                    .attr("fill", function(d, i) {
                        return heatColorScale[i];
                    })
                    .style("opacity", 0.5);
            heatMap.selectAll(".htCell")
                    .transition()
                    .duration(200)
                    .attr("fill", function(d) {
                        return colorHeat(d.value);
                    });
        }

        function hideHeat() {
            if (pointer.parameters.isHeatView) {
                heatMap.selectAll(".htCell").remove();
                heatMap.selectAll(".htIndex").remove();
                heatData = [];
                pointer.hideHeatPane();
            }
        }

        function wordCloud() {
            d3.layout.cloud()
                .size([width-20, height])
                .words(wordDict.nodes)
                .font("impact")
                .rotate(function() { 
                    if (pointer.parameters.graphPara.angle == 0) {
                        return 0;
                    } else if(pointer.parameters.graphPara.angle == 90) {
                        if (Math.random() > 0.6) {
                            return 90;
                        } else {
                            return 0;
                        }
                    } else {
                        return ~~(Math.random() * 5) * 30;
                    }
                })
                .fontSize(function(d) {
                    return pointer.optimiseSize(d.termIndex); })
                .start();
        }
        
        function showHeatMap() {
            if (heatData.length != 0) {
                updateHeatData();
                heatMap.selectAll(".htCell")
                        .attr("fill", function(d) {
                            return colorHeat(d.value);
                        });
            } else {
                giveHeat();
            }
        }

        var showTermInfo = function(d) {
            var info2 = "<div class='bod'><p>Search: </p>";
            var quickQuery = myVsearch.lastQuery + " AND " + d.text;
            info2 += "<mark class='markedQuery'>" + myVsearch.lastQuery + "</mark>";
            info2 += " + <mark class='markedQuery'>" + d.text + "</mark></div>";
            info2 += "<button class=subButton id='quickSearch'>go</button>";
            d3.select("#infoG").html(info2);
            d3.select("#quickSearch").on("click", function() { 
                myVsearch.quickRequest(quickQuery);
            })
            reOrderList.whichElement(d.text);
        }

        function draw() {
            wordPane.selectAll("text")
                .data(wordDict.nodes)
                .enter().append("text")
                .style("font-size", function(d) { return d.size + "px"; })
                .style("fill", fillControl)
                .attr("text-anchor", "middle")
                .attr("transform", function(d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .attr("class", "words")
                .on("mouseover", fadeIn)
                .on("mouseout", fadeOut)
                .text(function(d) { return d.text; })
                .on("click", function(d) {
                    showTermInfo(d);
                });
                // .style("opacity", opacityControl);
        }

        function opacityControl(d) {
            if (pointer.parameters.isHeatView || pointer.parameters.groupPara.isGroupColor) {
                return 1;
            } else {
                if (d.degree > 20) {
                    return 1;
                } else if (d.degree > 10) {
                    return 0.92;
                } else if (d.degree > 5) {
                    return 0.88;
                } else if (d.degree > 3) {
                    return 0.84;
                } else if (d.degree > 2) {
                    return 0.78;
                } else {
                    return 0.74;
                }
            }
        }

        function fillControl(d) {
            if (pointer.parameters.isHeatView) {
                if (d.hasOwnProperty("ogod")) {
                    return heatWords(d.ogod);
                } else {
                    return heatWords(d.group);
                }
            } else if (pointer.parameters.groupPara.isGroupColor) {
                return groupFill(d.group);
            } else {
                return fill(d.ogod);
            }
        }
        var listOrdered = [];

        function reListWords() {
            hideHeat();
            utilObj.hidePara("htmap");
            var cordX, cordY, tranResult;
            if (listOrdered.length == 0) {
                listOrdered = utilObj.clone(wordDict.nodes);
                listOrdered.sort(forListSort);//function(a, b) { return b.degree - a.degree ; });
            }
            var arrayForIndex = [];
            for (i = 0, len = listOrdered.length; i < len; i += 1) {
                arrayForIndex.push(listOrdered[i].text);
            }
            var maxRectWidth = 100, minRectWidth = 15, tempWidth, scaleM = arrayForIndex.length;
            var colorScale = d3.scale.quantile()
                                .domain([0, scaleM])
                                .range(colorForOrder);
            // var arrayForEngValue = arrayForIndex.slice(0,20);
            // var engInterGraph = getSubInterGraph(arrayForEngValue, wordDict);
            // var engProp = getEntangleProperty(engInterGraph);
            // var engTestDict = {};
            // for (i = 0; i < engInterGraph.sizeOfMatrix; i += 1) {
            //     engTestDict[engInterGraph.nodes[i].text] = engProp.vector[i];
            // }
            pointer.parameters.isListView = true;
            perRow = middleY / 10;
            wordPane.selectAll(".words")
                .transition()
                .duration(600)
                .attr("class", "liW")
                .style("font-size", "14px")
                .attr("text-anchor", "end")
                .style("fill", "black")
                .attr("transform", function(d, i) {
                    cordX = Math.floor(arrayForIndex.indexOf(d.text) / perRow) * 180 - middleX + 120;
                    cordY = Math.floor(arrayForIndex.indexOf(d.text) % perRow) * 16 - middleY + 38;
                    tranResult = "translate(" + [cordX, cordY] + ")rotate(0)";
                    return tranResult;
                });

            wordPane.selectAll(".windex")
                .data(arrayForIndex)
                .enter()
                .append("rect")
                .transition()
                .duration(600)
                .attr("transform", function(d, i) {
                    cordX = Math.floor( i / perRow) * 180 - middleX + 124;
                    cordY = Math.floor( i % perRow) * 16 - middleY + 26;
                    tranResult = "translate(" + [cordX, cordY] + ")rotate(0)";
                    return tranResult;
                })
                .attr("class", "windex")
                .attr("height", 14)
                .attr("width", function(d, i) {
                    tempWidth = (Math.log(listOrdered[i].termIndex) / Math.log(listOrdered[0].termIndex))
                                    * (maxRectWidth - minRectWidth) + minRectWidth;
                    return tempWidth;
                })
                .attr("fill", function(d, i) {
                    return colorScale(scaleM - i);
                });
        }

        function update() {
            wordPane.selectAll("text")
                .transition()
                .duration(600)
                .style("font-size", function(d) { return d.size + "px"; })
                .attr("transform", function(d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .attr("class", "words")
                .attr("text-anchor", "middle")
                .style("fill", fillControl);
                // .style("opacity", opacityControl);
        }

        function reCloud() {
            pointer.hideListPane();
            utilObj.showBlockPara("htmap");
            wordPane.selectAll(".windex").remove();
            update();
        }

        function fadeIn(g, i) {
            if (pointer.parameters.isListView ) { return 0; };
            showMeanfulSentance(g.text, true);
            if (pointer.parameters.isHeatView) { return 0; };
            var tempGroupsTerms = [];
            var showNum = 0;
            var maxShowNum = 14;
            d3.selectAll(".words")
                .transition()
                .duration(400)
                .style("opacity", 0.1)
                .filter(function(d, j) {
                    if (pointer.parameters.groupPara.isGroupFilter && pointer.parameters.groupPara.isGroupColor) {
                        if (g.group == d.group) {
                            tempGroupsTerms.push(d.text);                        
                            return true;
                        } else {
                            return false;
                        }
                    } else if(pointer.parameters.groupPara.isGroupFilter) {
                        if (g.ogod == d.ogod) {
                            tempGroupsTerms.push(d.text);                        
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        if (testNeighbour(i, j, wordDict) && showNum < maxShowNum) {
                            showNum += 1;
                            return true;
                        } else {
                            return false;
                        }
                    }
                })
                .style("opacity", 1);
                // .filter(function(d) {
                //     if (makeGroup.isGroupFilter || makeGroup.pointer.parameters.isHeatView) {
                //         return false;
                //     } else {
                //         return true;
                //     }
                // });
                // .style("font-size", function(d) {
                //     if (g.termIndex > 50) {
                //         return d.size + "px";
                //     }
                //     if (g.text === d.text) {
                //         return g.size > 28 ? g.size + "px" : "28px";
                //     }
                //     if (subInterGraph === "undefined") {
                //         subInterGraph = getSubInterGraph(neighbours.neighbourList[g.text]);
                //         showEntangInfo(subInterGraph, true, 0);
                //         len = subInterGraph.sizeOfMatrix;
                //         for (i = 0; i < len; i += 1) {
                //             tempText = subInterGraph.nodes[i].text;
                //             if (tempText === g.text) {
                //                 clickedOrder = i;
                //                 break;
                //             }
                //         }
                //     }
                //     for (i = 0; i < len; i += 1) {
                //         tempText = subInterGraph.nodes[i].text;
                //         if (tempText === d.text) {
                //             cOrder = i;
                //             break;
                //         }
                //     }
                //     index  = subInterGraph.matrix[clickedOrder][cOrder];
                //     optiSize = index * 18 + 16;
                //     optiSize = index * 18 + 16;
                //     return  optiSize + "px";
                // });
            // if (makeGroup.isGroupFilterW) {
            //     var sameGroupInterGraph = getSubInterGraph(tempGroupsTerms);
            //     showEntangInfo(sameGroupInterGraph, true, 1);
            // }
        }

        function fadeOut() {
            if (pointer.parameters.isListView) { return 0; };
            showMeanfulSentance(null, false);
            if (pointer.parameters.isHeatView) { return 0; };
            subInterGraph = "undefined";
            // showEntangInfo(subInterGraph, false, 0);
            d3.selectAll(".words")
                .transition()
                .duration(400)
                .style("opacity", 1);
                // .style("opacity", opacityControl);
        }

        wordCloud();
        draw();

        d3.select("#wlst")
            .on("click", function() {
                if (!pointer.parameters.isListView) {
                    d3.select("#wlst")
                        .style("background-color", "#F08080");
                    reListWords();
                } else {
                    reCloud();
                }
            });

        d3.select("#gfcw").on("click", function() {
            if (pointer.parameters.isListView) {
                reCloud();
            }
            hideHeat();
            if (pointer.updateGroupParameters()) {

            } else {
                update();
            };
        });

        d3.select("#htmap")
            .on("click", function() {
                if (pointer.parameters.isListView) {
                    reCloud();
                }
                if (!pointer.parameters.isHeatView) {
                    pointer.parameters.isHeatView = true;
                    d3.select("#htmap").style("background-color", "#F08080");
                    showHeatMap();
                } else {
                    hideHeat();
                }
                update();
            });
    }

    function showEntangInfo(subInterGraph, isShow, kind) {
        if (!isShow) {
            d3.select("#sInfo").html('<div id="infoC"></div><div id="infoG"></div>');
            return 0;
        }
        var position, info, entangInfo, markLabel;
        
        if (kind == 0) {
            markLabel = "<mark>";
            info = "<div class='bod'><p>There are " + markLabel + subInterGraph.sizeOfMatrix + "</mark> terms ";
            position = "#infoC";
            info += "connected.<hr />";
        } else {
            markLabel = "<mark class='markedQuery'>";
            info = "<div class='bod'><p>" + markLabel + subInterGraph.sizeOfMatrix + "</mark> terms ";
            position = "#infoG";
            info += "in a same group.<hr />";
        }
        entangInfo = getEntangleProperty(subInterGraph);
        if (entangInfo != -1) {
            info += "<p class='entTil'>Entanglement information:<p>";
            info += "<p class='entInfo'>Intensity: ";
            info += markLabel + entangInfo.intensity.toString().substr(0,6) + "</mark></p>";
            info += "<p class='entInfo'>Homogeneity: ";
            info += markLabel + entangInfo.homogeneity.toString().substr(0,6) +"</mark></p></div>";
        } else {
            info += "<p>Can't computer eigenvalue..</p>";
            info += "<p>The homogeneity is around <mark class='markedQuery'>0.2</mark></p>";
            info += "<p>The indensity is less than <mark class='markedQuery'>0.1</mark></p></div>";
        }
        d3.select(position).html(info);
    }

    function showMeanfulSentance(interestedTopic, isShow) {
        if (!isShow) {
            d3.select("#infoC").html('');
            return 0;
        }
        var result, info1;
        result = findSentance("doc", interestedTopic);
        if (result == -1) {
            result = findSentance("title", interestedTopic);
        }
        if (result != -1) {
            var mtop = "<b>" + interestedTopic + "</b>";
            var egTopic = new RegExp(interestedTopic, "i");
            result = result.replace(egTopic, mtop);
            info1 = "<div class='bod'><p id='sen'>" + result + ".</p></div>";
        }
        d3.select("#infoC").html(info1);
    }

    function forceLayout(pointer) {
        var termGraph = pointer.myData;
        var winHeight, winWidth;
        winHeight = parseInt(termGraph.sizeOfMatrix*2) + 400;
        winWidth = winHeight + 400;

        var subInterGraph = "undefined";
        var color = d3.scale.category20();
        var groupFill = d3.scale.category10();
        var svg = d3.select("#gfl")
                    .append("svg:svg")
                    .attr("height", winHeight)
                    .attr("width", winWidth);

        var force = d3.layout.force()
                        .nodes(termGraph.nodes)
                        .links(termGraph.links)
                        .charge(-200)
                        .friction(0.5)
                        .linkDistance(pointer.parameters.graphPara.nodesDist)
                        .size([winWidth, winHeight])
                        .start();

        var link = svg.selectAll("line.link")
                    .data(termGraph.links)
                    .enter().append("svg:line")
                    .attr("class", "link")
                    .attr("x1", function(d){ return d.source.x; })
                    .attr("y1", function(d){ return d.source.y; })
                    .attr("x2", function(d){ return d.target.x; })
                    .attr("y2", function(d){ return d.target.y; })
                    .style("strock-width", 0.2);

        function dragstart(d, i) {
            force.stop();
            svg.selectAll("g.node").on("mouseover", null).on("mouseout", null);
            d3.selectAll(".label").on("mouseover", null).on("mouseout", null);
        }

        function dragmove(d, i) {
            d.px += d3.event.dx;
            d.py += d3.event.dy;
            d.x += d3.event.dx;
            d.y += d3.event.dy;
            d.px = Math.max(20, Math.min(winWidth - 20, d.px));
            d.py = Math.max(20, Math.min(winHeight - 20, d.py));
            d.x = Math.max(20, Math.min(winWidth - 20, d.x));
            d.y = Math.max(20, Math.min(winHeight - 20, d.y));
            tick();
        }

        function dragend(d, i) {
            svg.selectAll("g.node").on("mouseover", fadeIn).on("mouseout", fadeOut);
        }

        var node_drag = d3.behavior.drag()
                    .on("dragstart", dragstart)
                    .on("drag", dragmove)
                    .on("dragend", dragend);

        var node = svg.selectAll("g.node")
                    .data(termGraph.nodes)
                    .enter().append("svg:g")
                    .attr("class","node")
                    .on("mouseover", fadeIn)
                    .on("mouseout", fadeOut)
                    .on("click", function(d) {
                        reOrderList.whichElement(d.text);
                    })
                    .call(node_drag);

        node.append("circle")
            .attr("class", "circle")
            .attr("r", function(d) {
                d.nodeSize = pointer.optimiseSize(d.termIndex);
                return d.nodeSize; })
            .style("fill", function(d, i) {
                if (pointer.parameters.groupPara.isGroupColor) {
                    return color(d.group);
                } else {
                    return color(i);
            }});

        node.append("svg:text")
            .attr("class","label")
            .attr("dx", 8)
            .attr("text-anchor", "start")
            .attr("dy", ".35em")
            .text(function(d) { return d.text; })
            .style("display", function() {
                return termGraph.sizeOfMatrix > 30 ? "none" : "inline";
            });

        function tick() {
            link.attr("x1", function(d) { return d.source.x; })
              .attr("y1", function(d) { return d.source.y; })
              .attr("x2", function(d) { return d.target.x; })
              .attr("y2", function(d) { return d.target.y; });

            node.attr("transform", function(d) {
                d.x = Math.max(20, Math.min(winWidth - 20, d.x));
                d.y = Math.max(20, Math.min(winHeight - 20, d.y));
                return "translate(" + d.x + "," + d.y + ")";});
        }

        force.on("tick", tick);

        function fadeIn(d, i) {
            var sameGroupTerms = [];
            var clickedOrder, cOrder, index, c1, c2;
            node.transition()
                .duration(400)
                .style("opacity", 0.1)
                .filter(function(g, j) {
                    if (pointer.parameters.groupPara.isGroupFilter) {
                        if (g.group === d.group) {
                            sameGroupTerms.push(j);
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        if (g.group === d.group) {
                            sameGroupTerms.push(j);
                        };
                        if (testNeighbour(i, j, termGraph)) {
                            return true;
                        } else {
                            return false;
                        }} 
                    })
                .style("opacity", 1)
                .select("circle")
                .attr("r", function(g, k) {
                    if (pointer.parameters.groupPara.isGroupFilter) {
                        if (k !== i) {
                            return 20 * (0.5 + termGraph.matrix[i][k] * termGraph.matrix[k][i]);
                        } else {
                            return 20;
                        }
                    } else {
                        if (g.text === d.text) {
                            return d.nodeSize;
                        } else {
                            if (subInterGraph === "undefined") {
                                subInterGraph = getSubInterGraph(termGraph.neighbourDict[i], termGraph);
                                showEntangInfo(subInterGraph, true, 0);
                                clickedOrder = getTermIndex(d.text, subInterGraph);
                            }
                            cOrder = getTermIndex(g.text, subInterGraph);
                            index  = subInterGraph.matrix[clickedOrder][cOrder] * subInterGraph.matrix[cOrder][clickedOrder];
                            return 20 * (0.5 + index);
                        }
                    }
                });

            if (pointer.parameters.groupPara.isGroupFilter) {
                subInterGraph = getSubInterGraph(sameGroupTerms, termGraph);
                showEntangInfo(subInterGraph, true, 1);
            } else {
                var sameGroupInterGraph = getSubInterGraph(sameGroupTerms, termGraph);
                showEntangInfo(sameGroupInterGraph, true, 1);
            };

            link.transition()
                .duration(400)
                .style("opacity", function (o) {
                    if (testNeighbour(o.source.text, o.target.text, subInterGraph)) {
                        return 1;
                    } else {
                        return 0.1;
                    }
                });

            node.select(".label").transition()
                .duration(400)
                .style("display", "none")
                .filter(function(o) {
                    if (pointer.parameters.groupPara.isGroupFilter) {
                        if (o.group == d.group) {
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        return testNeighbour(d.text, o.text, subInterGraph) != 0;
                    }
                })
                .style("display", "inline");
        }

        function fadeOut(d) {
            subInterGraph = "undefined";
            node.transition()
                .duration(400)
                .style("opacity", 1)
                .select("circle")
                .attr("r", function(d) { 
                    return pointer.optimiseSize(d.termIndex); 
                });

            link.transition().style("opacity", 1);
            showEntangInfo(null, false, 0);
            node.select(".label")
                .transition()
                .style("display", function() {
                    return termGraph.sizeOfMatrix > 30 ? "none" : "inline";
                });
        }

        d3.select("#gfcn").on("click", function() {
            if (pointer.updateGroupParameters()) {
                console.log(pointer.parameters.groupPara.groupNum);
                makeGroup.groupTheGraph(termGraph, pointer.parameters.groupPara.groupNum);
                node.select("circle")
                    .style("fill", function(d, i) {
                        if (pointer.parameters.groupPara.isGroupColor) {
                            return color(d.group);
                        } else {
                            return color(i);
                        }
                    });
            }
        });
    }

    function matrixHeatMapLayout(pointer) {
        var objectMatrix = pointer.myData;
        var margin = { top: 100, right: 0, bottom: 100, left: 100 },
            mSize = objectMatrix.sizeOfMatrix,
            gridSize = parseInt(20 - (mSize / 10)),
            width = mSize * gridSize + 300,
            height = mSize * gridSize + 160,
            w2 = gridSize * mSize + 40;
            legendElementWidth = 30,
            buckets = 10,
            colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#48D1CC","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"];

        var groupFill = d3.scale.category10();
        var colorScale = d3.scale.quantile()
            .domain([0, 1])
            .range(colors);

        var svg = d3.select("#gmx").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var cordY = svg.selectAll(".cordY")
            .data(objectMatrix.nodes)
            .enter().append("text")
            .text(function (d) { return d.text; })
            .attr("x", 0)
            .attr("y", function (d, i) { return i * gridSize + 2; })
            .style("font-size", gridSize + "px")
            .style("fill", "#000")
            .style("text-anchor", "end")
            .attr("transform", "translate(0," + gridSize / 1.5 + ")");

        var cordX = svg.selectAll(".cordX")
            .data(objectMatrix.nodes)
            .enter().append("text")
            .text(function(d) { return d.text; })
            .attr("x", 0)
            .attr("y", function(d, i) { return i * gridSize + 14; })
            .style("font-size", gridSize + "px")
            .style("fill", "#000")
            .style("text-anchor", "start")
            .attr("transform", "translate(" + gridSize / 2 + ', -6)rotate(-90)');

        var heatMap = svg.selectAll(".entangleIndice")
            .data(objectMatrix.heatMatrix)
            .enter().append("rect")
            .attr("x", function(d, i) { return (i%mSize)*gridSize + 10; })
            .attr("y", function(d, i) { return Math.floor(i/mSize)*gridSize; })
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("class", "entangleIndice bordered")
            .attr("width", gridSize)
            .attr("height", gridSize)
            .style("fill", colors[0]);

        function updateHeatValue() {
            heatMap.transition().duration(1600)
                .style("fill", function(d, i) {
                    if (d.termIndex === 0) {
                        return "#FFFFFF";
                    } else {
                        return colorScale(d); 
                    }
                });
            heatMap.select("title").text(function(d) { return d; });
        }

        heatMap.append("title").text(function(d) { return d; });
            
        updateHeatValue();

        var legend = svg.selectAll(".legend")
            .data([0].concat(colorScale.quantiles()), function(d) { return d; })
            .enter().append("g")
            .attr("class", "legend");

        legend.append("rect")
            .attr("x", w2)
            .attr("y", function(d, i) { return legendElementWidth * (i - 1) + 30; })
            .attr("width", 10)
            .attr("height", legendElementWidth)
            .style("fill", function(d, i) { return colors[i]; });

        legend.append("text")
            .attr("class", "mono")
            .style("font-size", gridSize / 2)
            .text(function(d) { return ">" + d.toFixed(2); })
            .attr("x", w2+12)
            .attr("y", function(d, i) { return legendElementWidth * (i - 1) + legendElementWidth/2+38; });

        function updatePosiData() {
            var tempNum = pointer.parameters.groupPara.groupNum;
            makeGroup.groupTheGraph(objectMatrix, tempNum);
            var i, j, tempIndex, tempTerm;
            tempIndex = 0;
            for (i = 1; i <= tempNum; i += 1) {
                for (j = 0; j < mSize; j += 1) {
                    if (objectMatrix.nodes[j].group == i) {
                        objectMatrix.nodes[j].gOrder = tempIndex;
                        tempIndex += 1;
                    }
                }
            }
        };

        d3.select("#gfcm").on("click", function() {
            if (pointer.updateGroupParameters()) {
                updatePosiData();
                cordX.transition().duration(300)
                    .style("fill", function(d) {
                        return groupFill(d.group);
                    })
                    .attr("y", function(d, i) {
                        return d.gOrder * gridSize + 14;
                    });
                cordY.transition().duration(300)
                    .style("fill", function(d) {
                        return groupFill(d.group); })
                    .transition()
                    .attr("y", function(d, i) {
                        return d.gOrder * gridSize + 2;
                    });

                var t0, t1, tX, tY;
                heatMap.transition().duration(300)
                    .attr("x", function(d, i) {
                        t0 = i%mSize;
                        tX = objectMatrix.nodes[t0].gOrder;
                        return  tX*gridSize + 10; })
                    .transition()
                    .attr("y", function(d, i) {
                        t1 = Math.floor(i/mSize);
                        tY = objectMatrix.nodes[t1].gOrder;
                        return tY*gridSize;
                    });
            };
        });
    }

    function bubbleLayout(pointer) {
        var padding = 0, // separation between same-color circles
            clusterPadding = 5, // separation between different-color circles
            maxRadius = 20;
        var n = pointer.myData.sizeOfMatrix,
            m = pointer.parameters.groupPara.groupNum;

        var width = parseInt((n / 200) * 400 + 750),
            height = width  - 420;
        var color = d3.scale.category10()
                        .domain(d3.range(m));

        var nodes = [], index, groupNO, oneTerm, rad, name, oneNode, clusters = [];
        for (index = 0; index < n; index += 1) {
            oneTerm = pointer.myData.nodes[index];
            name = oneTerm.text;
            groupNO = oneTerm.group;
            rad = pointer.optimiseSize(oneTerm.termIndex);
            oneNode = {cluster: groupNO, radius: rad, text: name};
            if (!clusters[oneNode.cluster] || (oneNode.radius > clusters[oneNode.cluster].radius)) {
                    clusters[oneNode.cluster] = oneNode;
                }
            nodes.push(oneNode);
        }

        function updateCluster() {
            for (index = 0; index < n; index += 1) {
                nodes[index].cluster = makeGroup.groupsInfo[nodes[index].text];
            }
        }

        d3.layout.pack()
            .size([width, height])
            .children(function(d) { return d.values; })
            .value(function(d) { return d.radius * d.radius; })
            .nodes({values: d3.nest()
                    .key(function(d) { return d.cluster; })
                    .entries(nodes)});

        var force = d3.layout.force()
            .nodes(nodes)
            .size([width, height])
            .gravity(0)
            .charge(0)
            .on("tick", tick)
            .start();

        var tag_Name = "#" + this.tagID;
        var svg = d3.select(tag_Name).append("svg")
            .attr("width", width)
            .attr("height", height);

        var circle = svg.selectAll(".bubble")
            .data(nodes)
            .enter().append("g")
            .attr("class", "bubble")
            .on("mouseover", fadeIn)
            .on('mouseout', fadeOut)
            .on("click", function(d) {
                reOrderList.whichElement(d.text);
            })
            .call(force.drag);

        var tempLen, tempSize;
        circle.append("svg:circle")
                .attr("class", "circle")
                .style("fill", function(d) { return color(d.cluster); })
                .style("fill-opacity", 0.4);

        circle.append("svg:text")
              .text(function(d) { return d.text; })
              .style("font-size", 0)
              .attr("text-anchor", "middle")
              .attr("font-family","sans-serif")
              .attr("dy", function(d) { return d.radius/4; });

        circle.select("circle")
            .transition()
            .duration(500)
            .delay(function(d, i) {return i * 10; })
            .attrTween("r", function(d) {
                var i = d3.interpolate(0, d.radius);
                return function(t) {
                    return d.radius = i(t);
                };
            });

        d3.select("#gfcb").on("click", function() {
            pointer.updateGroupParameters();
            if (!pointer.parameters.groupPara.isUpdate) {
                if (pointer.parameters.groupPara.groupNum !== m) {
                    m = pointer.parameters.groupPara.groupNum;
                    makeGroup.groupTheGraph(pointer.myData, m);
                    updateCluster();
                    circle.selectAll(".circle")
                        .transition()
                        .duration(200)
                        .style("fill", function(d) {
                            return color(d.cluster);
                        });
                }
            }
        });

        circle.select("text")
            .transition()
            .duration(600)
            .delay(function(d, i) {return i * 10; })
            .style("font-size", function(d) {
                    tempLen = d.text.length;
                    tempSize = d.radius * 10 / (3 * tempLen);
                    tempSize += 2;
                    return Math.round(tempSize) + "px"; 
                  })

        function tick(e) {
            circle.each(cluster(10 * e.alpha * e.alpha))
                    .each(collide(.2))
                    .attr("x", function(d) {
                        return d.x = Math.max(d.radius, Math.min(width - d.radius, d.x));
                    })
                    .attr("y", function(d) {
                        return d.y = Math.max(d.radius, Math.min(height - d.radius, d.y));})
                    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"});
        }

        function fadeIn(d) {
            if (pointer.parameters.groupPara.isFilterGroup) {
                circle.transition()
                    .duration(300)
                    .style("opacity", 0.1)
                    .filter(function(g) {
                        if (g.cluster == d.cluster) {
                            return true;
                        } else {
                            return false;
                        }
                        })
                    .style("opacity", 1);
                }
        }

        function fadeOut(d) {
            if (!pointer.parameters.groupPara.isFilterGroup) {
                return;
            }
            circle.transition()
                    .duration(300)
                    .style("opacity", 1);
        }

        function cluster(alpha) {
            return function(d) {
                var cluster = clusters[d.cluster],
                    k = 1;
                if (cluster === d) {
                  cluster = {x: width / 2, y: height / 2, radius: -d.radius};
                  k = .1 * Math.sqrt(d.radius);
                }
                var x = d.x - cluster.x,
                    y = d.y - cluster.y,
                    l = Math.sqrt(x * x + y * y),
                    r = d.radius + cluster.radius;
                if (l != r) {
                    l = (l - r) / l * alpha * k;
                    d.x -= x *= l;
                    d.y -= y *= l;
                    cluster.x += x;
                    cluster.y += y;
                }
            }
        }

        // Resolves collisions between d and all other circles.
        function collide(alpha) {
            var quadtree = d3.geom.quadtree(nodes);
            return function(d) {
                var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
                    nx1 = d.x - r,
                    nx2 = d.x + r,
                    ny1 = d.y - r,
                    ny2 = d.y + r;
                quadtree.visit(function(quad, x1, y1, x2, y2) {
                    if (quad.point && (quad.point !== d)) {
                        var x = d.x - quad.point.x,
                        y = d.y - quad.point.y,
                        l = Math.sqrt(x * x + y * y),
                        r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
                        if (l < r) {
                            l = (l - r) / l * alpha;
                            d.x -= x *= l;
                            d.y -= y *= l;
                            quad.point.x += x;
                            quad.point.y += y;
                        }
                    }
                return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
                });
            };
        }
    }

    function dendrogramLayout(pointer) {

        var cluster = d3.layout.cluster()
            .size([pointer.height, pointer.width - 200]);

        var diagonal = d3.svg.diagonal()
        .projection(function(d) { return [d.y, d.x]; });
        var tag_Name = "#" + pointer.tagID;
        var svg = d3.select(tag_Name).append("svg")
                    .attr("width", pointer.width)
                    .attr("height", pointer.height)
                    .append("g")
                    .attr("transform", "translate(100,0)");

        var nodes = cluster.nodes(pointer.myData),
            links = cluster.links(nodes);

        var link = svg.selectAll(".denlink")
                        .data(links)
                        .enter().append("path")
                        .attr("class", "denlink")
                        .attr("d", diagonal);

        var node = svg.selectAll(".dennode")
                        .data(nodes)
                        .enter().append("g")
                        .attr("class", "dennode")
                        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

        node.append("circle")
            .attr("r", 4.5);

        node.append("text")
            .attr("dx", function(d) { return d.children ? -8 : 8; })
            .attr("dy", 3)
            .attr("class", "dentext")
            .style("font-size", function(d) { return d.children ? "14px" : "12px"; })
            .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
            .text(function(d) { return d.text; })
            .on("click", function(d) {
                reOrderList.whichElement(d.text);
            });
    }

    var OneWindow = function(divName, parameter) {
        this.tagID = divName;
        this.parameters = parameter;
        this.isDiplayed = false;
    }

    OneWindow.prototype.updateGroupParameters = function() {};
    OneWindow.prototype.updateGraphParameters = function(formElements) {
        if (formElements.item(0).checked) {
            this.parameters.graphPara.nlpParas.checkedItems = [];
            this.parameters.graphPara.nlpParas.isChecked = true;
            for (var i = 1; i < 6; i += 1) {
                if (formElements.item(i).checked) {
                    this.parameters.graphPara.nlpParas.checkedItems.push(i-1);
                }
            }
        }
        if (this.parameters.graphPara.nlpParas.checkedItems.length == 0) {
            this.parameters.graphPara.nlpParas.checkedItems = [0, 2];
            formElements.item(1).checked = true;
            formElements.item(2).checked = true;
        }
        for (var i = 6; i < 9; i += 1) {
            if (formElements.item(i).checked) {
                this.parameters.graphPara.scale = formElements.item(i).value;
            }
        }
    };

    OneWindow.prototype.showMethod = function() {};
    OneWindow.prototype.initialMethod = function() {
        this.myData = getTheGraphs(this.parameters.graphPara.nlpParas)
        var that = this;
        if (this.parameters.groupPara) {
            utilObj.addEvent(this.parameters.groupPara.submitTag, "click", function() {
                setTimeout(function() {utilObj.hidePara(that.parameters.groupPara.tagId);}, 400);
            });
        }
        if (this.parameters.graphPara) {
            utilObj.addEvent(this.parameters.graphPara.submitTag, "click", function() {
                setTimeout(function() {utilObj.hidePara(that.parameters.graphPara.tagId);}, 400);
            })
        }
    };
    OneWindow.prototype.formListener = function() {
        if (this.parameters.graphPara) {
            utilObj.addFormListener(this.parameters.graphPara.formTagName, this.updateGraphParameters);
        }
        if (this.parameters.groupPara) {
            utilObj.addFormListener(this.parameters.groupPara.formTagName, function(){});
        }
    };

    OneWindow.prototype.hideWin = function() {
        utilObj.hidePara(this.tagID);
        this.displayParameters(false);
    }

    OneWindow.prototype.optimiseSize = function(inputSize) {
        if (!this.parameters.biggestSize) return 0;
        var preRes, normalSize;
        var upBoundSize = 200;
        normalSize = inputSize > upBoundSize ? upBoundSize : inputSize;
        switch (this.parameters.graphPara.scale) {
            case "log":
                preRes = Math.log(normalSize)/Math.log(upBoundSize);
                break;
            case "sqrt":
                preRes = Math.sqrt(normalSize)/Math.sqrt(upBoundSize);
                break;
            default :
                preRes = normalSize/upBoundSize;
        }
        return preRes*(this.parameters.biggestSize-this.parameters.smallSize)+this.parameters.smallSize;
    }

    OneWindow.prototype.displayParameters = function(isShow) {
        if (!this.parameters.paraTag) return 0;
        if (isShow) {
            utilObj.showBlockPara(this.parameters.paraTag);
        } else {
            utilObj.hidePara(this.parameters.paraTag);
        }
    }

    OneWindow.prototype.showWin = function() {
        utilObj.showBlockPara(this.tagID);
        this.displayParameters(true);
        if (!this.isDiplayed) {
            this.initialMethod();
            this.formListener();
            this.showMethod(this);
            this.isDiplayed = true;
        }
    }

    OneWindow.prototype.clearGraphContent = function() {
        utilObj.clearContent(this.tagID);
    }

    function RequestHandle(tag_Name) {
        if (tag_Name === "wi") {
            return creatCloudTags("gwi");
        } else if (tag_Name === "fl") {
            return creatForceNodes("gfl");
        } else if (tag_Name === "mx") {
            return creatHeatMatrix("gmx");
        } else if (tag_Name === "bg") {
            return creatBubbleTags("gbg");
        } else if (tag_Name === "dg") {
            return creatDendrogram("dgg");
        }
    }

    function creatDendrogram(tag_Name) {
        var result = new OneWindow(tag_Name, paraDG);
        result.initialMethod = function() {
            result.constructor.prototype.initialMethod.call(result);
            var instance = result.myData;
            makeGroup.groupTheGraph(instance, 1);
            result.myData = getDendrogram(instance);
            result.height = 11 * instance.sizeOfMatrix;
            result.width = result.height / 2 + 200;
        };
        result.updateGraphParameters = function(formElements) {
            if (formElements.item(0).checked) {
                result.parameters.graphPara.nlpParas.checkedItems = [];
                result.parameters.graphPara.nlpParas.isChecked = true;
                for (var i = 1; i < 6; i += 1) {
                    if (formElements.item(i).checked) {
                        result.parameters.graphPara.nlpParas.checkedItems.push(i-1);
                    }
                }
            }
            if (result.parameters.graphPara.nlpParas.checkedItems.length == 0) {
                result.parameters.graphPara.nlpParas.checkedItems = [0, 2];
                formElements.item(1).checked = true;
                formElements.item(2).checked = true;
            }
            if (formElements.item(0).checked) {
                result.initialMethod();
                result.clearGraphContent();
                result.showMethod(result);
            }
        }
        result.showMethod = dendrogramLayout;
        return result;
    }

    function creatBubbleTags(tag_Name) {
        var result = new OneWindow(tag_Name, paraBB);
        result.initialMethod = function() {
            result.constructor.prototype.initialMethod.call(result);
            if (result.parameters.graphPara.maxBubbleNum < result.myData.sizeOfMatrix) {
                result.myData = reduceInterGraph(0, result.parameters.graphPara.maxBubbleNum, result.myData);
            }
            makeGroup.groupTheGraph(result.myData, result.parameters.groupPara.groupNum);
        };
        result.updateGraphParameters = function(formElements) {
            result.constructor.prototype.updateGraphParameters.call(result, formElements);
            var bubbleNum = formElements.item(9).value;
            bubbleNum = bubbleNum > result.myData.sizeOfMatrix ? result.myData.sizeOfMatrix : bubbleNum;
            if (bubbleNum != result.parameters.graphPara.maxBubbleNum) {
                result.parameters.graphPara.maxBubbleNum = bubbleNum;
                result.initialMethod();
            }
            if (result.parameters.graphPara.nlpParas.isChecked) {
                result.initialMethod();
            }
            result.clearGraphContent();
            result.showMethod(result);
        };
        result.updateGroupParameters = function() {
            var formElements = document.getElementById(result.parameters.groupPara.formTagName).elements;
            result.parameters.groupPara.isFilterGroup = formElements.item(0).checked;
            result.parameters.groupPara.groupNum = formElements.item(1).value;
            var isUpdate = formElements.item(3).checked;
            if (isUpdate) {
                result.clearGraphContent();
                result.showMethod(result);
            }
        };
        result.showMethod = bubbleLayout;
        return result;
    }

    function creatHeatMatrix(tag_Name) {
        var result = new OneWindow(tag_Name, paraHM);
        result.initialMethod = function() {
            result.constructor.prototype.initialMethod.call(result);
            var instance = reduceInterGraph(0, result.parameters.graphPara.maxMatrixSize, result.myData);
            var index1, index2, matrixIndice;
            instance.heatMatrix = []
            for (index1 = 0; index1 < instance.sizeOfMatrix; index1 += 1) {
                for (index2 = 0; index2 < instance.sizeOfMatrix; index2 += 1) {
                    matrixIndice = instance.matrix[index1][index2];
                    instance.heatMatrix.push(matrixIndice);
                }
            };
            result.myData = instance;
        };
        result.updateGraphParameters = function(formElements) {
            if (formElements.item(0).checked) {
                result.parameters.graphPara.nlpParas.checkedItems = [];
                result.parameters.graphPara.nlpParas.isChecked = true;
                for (var i = 1; i < 6; i += 1) {
                    if (formElements.item(i).checked) {
                        result.parameters.graphPara.nlpParas.checkedItems.push(i-1);
                    }
                }
            }
            if (result.parameters.graphPara.nlpParas.checkedItems.length == 0) {
                result.parameters.graphPara.nlpParas.checkedItems = [0, 2];
                formElements.item(1).checked = true;
                formElements.item(2).checked = true;
            }
            var maxMatrixSize = formElements.item(6).value;
            if (maxMatrixSize != result.parameters.graphPara.maxMatrixSize || result.parameters.graphPara.nlpParas.isChecked) {
                result.parameters.graphPara.maxMatrixSize = maxMatrixSize;
                result.initialMethod();
                result.clearGraphContent();
                result.showMethod(result);
            }
        };
        result.updateGroupParameters = function() {
            var formElements = document.getElementById(result.parameters.groupPara.formTagName).elements;
            var tempValue = formElements.item(0).value;
            if (result.parameters.groupPara.groupNum != tempValue) {
                result.parameters.groupPara.groupNum = tempValue;
                return true;
            } else {
                return false;
            }
        };
        result.showMethod = matrixHeatMapLayout;
        return result;
    }

    function creatForceNodes(tag_Name) {
        var result = new OneWindow(tag_Name, paraFN);
        result.initialMethod = function() {
            result.constructor.prototype.initialMethod.call(result);
            var instance = reduceInterGraph(0, result.parameters.graphPara.maxNodesNum, result.myData);  
            makeGroup.groupTheGraph(instance, result.parameters.groupPara.groupNum, false);
            result.myData = instance;
        };
        result.showWin = function() {
            result.constructor.prototype.showWin.call(result);
            utilObj.showBlockPara("sInfo");
        };
        result.hideWin = function() {
            result.constructor.prototype.hideWin.call(result);
            utilObj.hidePara("sInfo");
        }
        result.updateGraphParameters = function(formElements) {
            result.constructor.prototype.updateGraphParameters.call(result, formElements);
            var nodesNum = formElements.item(9).value;
            result.parameters.graphPara.nodesDist = formElements.item(11).value;
            if (nodesNum != result.parameters.graphPara.maxBubbleNum || result.parameters.graphPara.nlpParas.isChecked) {
                result.parameters.graphPara.maxNodesNum = nodesNum;
                result.initialMethod();
            }
            result.clearGraphContent();
            result.showMethod(result);
        };
        result.updateGroupParameters = function() {
            var formElements = document.getElementById(result.parameters.groupPara.formTagName).elements;
            result.parameters.groupPara.isGroupColor = formElements.item(0).checked;
            result.parameters.groupPara.isGroupFilter = formElements.item(1).checked;
            var tempValue = formElements.item(2).value;
            if (tempValue !== result.parameters.groupPara.groupNum) {
                result.parameters.groupPara.groupNum = tempValue;
                return true;
            } else {
                return false;
            }
        };
        result.showMethod = forceLayout;
        return result;
    }

    function creatCloudTags(tag_Name) {
        var result = new OneWindow(tag_Name, paraTH);
        result.initialMethod = function() {
            result.constructor.prototype.initialMethod.call(result);
            var instance = reduceInterGraph(0, result.parameters.graphPara.maxTagsNum, result.myData);  
            makeGroup.groupTheGraph(instance, result.parameters.groupPara.groupNum, true);
            result.myData = instance;
        };
        result.showWin = function() {
            result.constructor.prototype.showWin.call(result);
            utilObj.showBlockPara("sInfo");
        };
        result.hideWin = function() {
            result.constructor.prototype.hideWin.call(result);
            utilObj.hidePara("sInfo");
        };
        result.hideHeatPane = function() {
            if (result.parameters.isHeatView) {
                utilObj.setBackgroundColor("htmap", "#7FB5DA");
                result.parameters.isHeatView = false;
            }
        };
        result.hideListPane = function() {
            if (result.parameters.isListView) {
                result.parameters.isListView = false;
                utilObj.showBlockPara("htmap");
                utilObj.setBackgroundColor("wlst", "#7FB5DA");
            }
        }
        result.updateGraphParameters = function(formElements) {
            result.constructor.prototype.updateGraphParameters.call(result, formElements);
            var tempValue = formElements.item(9).value;
            result.parameters.graphPara.angle = formElements.item(11).value;
            if (tempValue != result.parameters.graphPara.maxTagsNum || result.parameters.graphPara.nlpParas.isChecked) {
                result.parameters.graphPara.maxTagsNum = tempValue;
                result.initialMethod();
            }
            result.clearGraphContent();
            result.showMethod(result);
        };
        result.clearGraphContent = function() {
            result.constructor.prototype.clearGraphContent.call(result);
            result.hideListPane();
            result.hideHeatPane();
        }
        result.updateGroupParameters = function() {
            var formElements = document.getElementById(result.parameters.groupPara.formTagName).elements;
            result.parameters.groupPara.isGroupColor = formElements.item(0).checked;
            result.parameters.groupPara.isGroupFilter = formElements.item(1).checked;
            var tempValue = formElements.item(2).value;
            var isUpdate = formElements.item(4).checked;
            if (isUpdate) {
                result.clearGraphContent();
                result.showMethod(result);
                return true;
            } else if (tempValue !== result.parameters.groupPara.groupNum) {
                result.parameters.groupPara.groupNum = tempValue;
                makeGroup.groupTheGraph(result.myData, result.parameters.groupPara.groupNum, true);
                return false;
            } else {
                return true;
            }
        };
        result.showMethod = cloudLayout;
        return result;
    }

    window.graphRequest = RequestHandle;

})(window);
