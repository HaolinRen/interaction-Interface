//build a graph of which key is term, value is documents index.
//return {term2Doc: {term1:[1, 2.],term2:[4]..}

function getTheGraphs(nlpPa) {
    var termGraph = term2Document(myVsearch.searchResults, nlpPa);
    var documentGraph = doc2Document(termGraph.term2Doc);
    var interactGraph = interactionGraph(documentGraph);
    return interactGraph;
}

function term2Document(searchResult, nlpPa) {
    var res = {term2Doc: {}};
    var tempTestList = [];
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
    var simpleList = ['noun', 'adverb','verb', 'adjective', 'value'];
    var index, len, index2, len2, index3, len3, nlpTag, index4, len4, flag,
        key, tempList, tempTerm, termWithS, alreadyExist, termOutS;
    for (index = 0, len = searchResult.length; index < len; index += 1) {
        tempList = searchResult[index].contentList();
        for (index2 = 0, len2 = tempList.length; index2 < len2; index2 += 1) {
            tempTerm = tempList[index2];
            // filter the plural of term
            alreadyExist = false;
            if (PLURAL_EN.hasOwnProperty(tempTerm)) {
                tempTerm = PLURAL_EN[tempTerm];
                for (index3 = 0, len3 = tempTestList.length; index3 < len3; index3 += 1) {
                    key = tempTestList[index3];
                    if (key === tempTerm) {
                        alreadyExist = true;
                        break;
                    }
                }
            } else {
                if (tempTerm.slice(-1) === "s") {
                    termOutS = tempTerm.slice(0, -1);
                } else {
                    termOutS = "";
                }
                termWithS = tempTerm + "s";
                         
                for (index3 = 0, len3 = tempTestList.length; index3 < len3; index3 += 1) {
                    key = tempTestList[index3];
                    if (key === tempTerm) {
                        alreadyExist = true;
                        break;
                    } else if (key === termWithS) {
                        res.term2Doc[tempTerm] = res.term2Doc[key];
                        delete res.term2Doc[key];
                        tempTestList[index3] = tempTerm;
                        alreadyExist = true;
                        break;
                    } else if (key === termOutS) {
                        tempTerm = termOutS;
                        alreadyExist = true;
                        break;
                    }
                }
            }
            if (nlpPa && nlpPa.isChecked) {
                nlpTag = nlp.pos(tempTerm).sentences[0].tags()[0];
                if (nlpTag) {
                    flag = false;
                    len4 = nlpPa.checkedItems.length;
                    for (index4 = 0; index4<len4; index4+=1) {
                        if (simpleList[nlpPa.checkedItems[index4]] == nlpTags[nlpTag]) {
                            flag = true;
                            break;
                        }
                    }
                    if (!flag) {
                        continue;
                    }
                } else {
                    continue;
                }
            }
            if (alreadyExist) {
                if (res.term2Doc[tempTerm].indexOf(index) == -1) {
                    res.term2Doc[tempTerm].push(index);
                }
            } else {
                tempTestList.push(tempTerm);
                res.term2Doc[tempTerm] = [index];
            }
        }
    }
    return res;
}

//[{"source":1, "target":4,"terms":[terms]...]
function doc2Document(term2docDict) {
    var term, docs,
        index, len, indice,
        index2, docs2, indice2;
    var result = [];
    var tempCheckDic = {};
    var tempCheckString;
    var i = 0;
    for (term in term2docDict) {
        docs = term2docDict[term];
        len = docs.length;
        for (index = 0; index < len - 1; index += 1) {
            indice = docs[index];
            for (index2 = index + 1; index2 < len; index2 += 1) {
                indice2 = docs[index2];
                tempCheckString = indice + "-" + indice2;
                if (!tempCheckDic.hasOwnProperty(tempCheckString)) {
                    result.push({source:indice, target:indice2, terms: [term]});
                    tempCheckDic[tempCheckString] = i;
                    i += 1;
                } else {
                    result[tempCheckDic[tempCheckString]].terms.push(term);
                }
            }
        }
    }
    return result;
}

function getConIndex(a, b, interGraph) {
    var i, len, oneLink, index;
    len = interGraph.links.length;
    index = 0;
    for (i = 0; i < len; i += 1) {
        oneLink = interGraph.links[i];
        if ((oneLink.source == a && oneLink.target == b) || (oneLink.source == b && oneLink.target == a)) {
            index = oneLink.value;
        }
    }
    return index;
}

function getInterMatrix(interGraphSource) {
    var result = interGraphSource;
    result.matrix = [];
    result.forceData = [];
    result.neighbourDict = {};
    var index1, index2;
    var len = result.sizeOfMatrix;
    var tempArray, tempIndex, tempVerIndex, tempAy;
    for (index1 = 0; index1 < len; index1 += 1) {
        tempArray = [];
        tempVerIndex = [];
        tempAy = [];
        for (index2 = 0; index2 < len; index2 += 1) {
            if (index2 === index1) {
                tempAy.push(index2);
                tempIndex = result.nodes[index1].termIndex / result.sumLinks;
            } else {
                tempIndex = getConIndex(index1, index2, result);
                tempIndex /= result.nodes[index2].termIndex;
                if (tempIndex > 0) {
                    tempVerIndex.push(index2);
                    tempAy.push(index2);
                }
            }
            tempArray.push(parseFloat(tempIndex.toFixed(6)));
        }
        result.forceData.push(tempVerIndex);
        result.matrix.push(tempArray);
        result.neighbourDict[index1] = tempAy;
    }
}

//return {nodes: [{text:term,termIndex:32},...], links:[{source:1,target:3,value:23}..]..}
function interactionGraph(doc2DocGraph) {
    var result = {nodes:[], links: []}, termList, index, len, index2,
        indice1, indice2, term1, term2, k, tempCheckString = "",
        tempCheckDic = {}, tempCheckList = {}, linkCheck = {}, i = 0, j = 0;
    var leng = doc2DocGraph.length
    for (k = 0; k < leng; k += 1) {
        termList = doc2DocGraph[k].terms;
        len = termList.length;
        for (index = 0; index < len; index += 1) {
            term1 = termList[index];
            if (!tempCheckList.hasOwnProperty(term1)) {
                if (len == 1) {
                    if (!linkCheck.hasOwnProperty(term1)) {
                        linkCheck[term1] = 1;
                    } else {
                        linkCheck[term1] += 1;
                    }
                    continue;
                } else {
                    if (!linkCheck.hasOwnProperty(term1)) {
                        result.nodes.push({text:term1, termIndex: 1});
                    } else {
                        result.nodes.push({text:term1, termIndex: linkCheck[term1]});
                        delete linkCheck[term1];
                    }
                }
                tempCheckList[term1] = i;
                i += 1;
            } else {
                result.nodes[tempCheckList[term1]].termIndex += 1;
            }
            indice1 = tempCheckList[term1];
            for (index2 = index + 1; index2 < len; index2 += 1) {
                term2 = termList[index2];
                if (!tempCheckList.hasOwnProperty(term2)) {
                    result.nodes.push({text:term2, termIndex: 0});
                    tempCheckList[term2] = i;
                    i += 1;
                }
                indice2 = tempCheckList[term2];
                tempCheckString = term1 + "-" + term2;
                if (!tempCheckDic.hasOwnProperty(tempCheckString)) {
                    result.links.push({"source":indice1,"target":indice2,"value":1});
                    tempCheckDic[tempCheckString] = j;
                    j += 1;
                } else {
                    result.links[tempCheckDic[tempCheckString]].value += 1;
                }
            }
        }
    }
    result.sumLinks = leng;
    result.sizeOfMatrix = result.nodes.length;
    getInterMatrix(result);
    getNodesDegree(result);
    return result;
}

function getMaxOfArray(dataIn) {
    var result = {value: 0, indice: 0};
    dataIn.forEach(function(i,t) {
        if (i > result.value) {
            result.value = i;
            result.indice = t;
        }
    })
    return result;
}
function getEntangleProperty(interGraphIn) {
    if (interGraphIn.sizeOfMatrix > 40 || interGraphIn.sizeOfMatrix == 0) {
        return -1;
    }

    var i, j;
    var result = {};
    var eigenInfo, lmd, interVector = [], temp, i, eigRe, index, v1 = 0, v2 = 0;
    try {
        eigRe = numeric.eig(interGraphIn.matrix);
        eigenInfo = getMaxOfArray(eigRe.lambda.x);
        lmd = eigenInfo.value;
        index = eigenInfo.indice;
        for (i = 0; i < interGraphIn.sizeOfMatrix; i += 1) {
            interVector.push(Math.abs(eigRe.E.x[i][index]));
        }
        for (i = 0; i < interGraphIn.sizeOfMatrix; i += 1) {
            temp = interVector[i];
            v1 += temp;
            v2 += temp * temp;
        }
        result.vector = interVector;
        result.homogeneity = v1 / (Math.sqrt(v2) * Math.sqrt(interGraphIn.sizeOfMatrix));
        result.intensity = lmd / interGraphIn.sizeOfMatrix;
        result.lambda = lmd;
    } catch(err) {
        console.log("Oops");
        return -1;
    }
    return result;
}

function getNodesDegree(interGraph) {
    var i, j, len, degreeNum;
    if (interGraph.hasOwnProperty("forceData")) {
        for (i = 0; i < interGraph.sizeOfMatrix; i += 1) {
            degreeNum = interGraph.forceData[i].length;
            interGraph.nodes[i].degree = degreeNum;
            interGraph.nodes[i].nodeSize = degreeNum;
        }
    } else {
        for (i = 0; i < interGraph.sizeOfMatrix; i += 1) {
            degreeNum = -1;
            for (j = 0; j < interGraph.sizeOfMatrix; j += 1) {
                if (interGraph.matrix[i][j] != 0) {
                    degreeNum += 1;
                }
            }
            interGraph.nodes[i].degree = degreeNum;
            interGraph.nodes[i].nodeSize = degreeNum;
        }
    }
}

function getTermsGroups(interGraphSource) {
    var termsGroups = {},
        bgstIndex, root, leaf;
    for (bgstIndex in interGraphSource.maxEle) {
        root = interGraphSource.maxEle[bgstIndex];
        leaf = bgstIndex.toString();
        if (termsGroups.hasOwnProperty(root)) {
            if (leaf == root) {
                continue;
            } else {
                termsGroups[root].push(leaf);
            }
        } else {
            if (leaf == root) {
                termsGroups[root] = [];
            } else {
                termsGroups[root] = [leaf];
            }
        }
    }
    interGraphSource.termsGroup = termsGroups;
}

function optimiseGroup(interGraphVersion1) {
    var isChanged, tempRoot, tempList, i, len, leafList, initialGroup, leaf, leafGroup, indice1, indice2;
    initialGroup = interGraphVersion1.termsGroup;
    for (tempRoot in initialGroup) {
        leafList = initialGroup[tempRoot];
        tempList = [];
        len = leafList.length;
        isChanged = false;
        for (i = 0; i < len; i += 1) {
            leaf = leafList[i];
            if (initialGroup.hasOwnProperty(leaf)) {
                if (len == 1) {
                    leafGroup = initialGroup[leaf];
                    if (leafGroup.length == 1 && leafGroup[0] == tempRoot) {
                        indice1 = interGraphVersion1.matrix[tempRoot][tempRoot];
                        indice2 = interGraphVersion1.matrix[leaf][leaf];
                        if (indice1 < indice2) {
                            isChanged = true;
                            delete initialGroup[tempRoot];
                        } else {
                            tempList.push(leaf);
                            delete initialGroup[leaf];
                        }
                    } else {
                        continue;
                    }
                } else {
                    continue;
                }
            } else {
                tempList.push(leaf);
            }
        }
        if (!isChanged) {
            initialGroup[tempRoot] = tempList;
        }
    }
}

function getMatrixVertiMax(interGraph) {
    var res = {}, i, len, index1, tempForce, maxForceID, maxForce, nbList, nbIndex;
    for (index1 = 0; index1 < interGraph.sizeOfMatrix; index1 += 1) {
        nbList = interGraph.forceData[index1];
        maxForce = 0;
        for (i = 0, len = nbList.length; i < len; i += 1) {
            nbIndex = nbList[i];
            tempForce = interGraph.matrix[nbIndex][index1] + interGraph.matrix[index1][nbIndex];
            if (tempForce > maxForce) {
                maxForceID = nbIndex;
                maxForce = tempForce;
            }
        }
        res[index1] = maxForceID;
    }
    interGraph.maxEle = res;
}

function getSubInterGraph(connectedTerms, interGraphOriginal) {
    var key, term, i, len = connectedTerms.length,
        newDocuGraph = {},
        tempRes = {},
        result = {};
    if (len == 0) {
        console.log("no terms selected");
        return 0;
    }
    for (i = 0; i < len; i += 1) {
        key = connectedTerms[i];
        term = interGraphOriginal.nodes[key].text;
        tempRes[term] = myVsearch.termGraph.term2Doc[term];
    }
    newDocuGraph = doc2Document(tempRes);
    result = interactionGraph(newDocuGraph);
    return result;
}

function reduceInterGraph(startPosit, sumTerms, interGraph) {
    var endPosit = sumTerms;
    if (endPosit > interGraph.sizeOfMatrix) {
        endPosit = interGraph.sizeOfMatrix;
    }
    var unKickList = [];
    var i, newInterGraph;
    for (i = startPosit; i < endPosit; i += 1) {
        unKickList.push(i);
    }
    newInterGraph = getSubInterGraph(unKickList, interGraph);
    return newInterGraph;
}

function getAVGForceFromTermToGroups(termID, groupID, interGraph, isGroup) {
    var leaf, memberNum, forceSum, i, len, leafList, tempForce,
        tempRoot, forceNeighbour, maxForce, maxForceID, maxForceValue, forceDict = {};
    var testID = 0;
    for (tempRoot in interGraph.termsGroup) {
        if (tempRoot == groupID && isGroup) {
            continue;
        }
        memberNum = 1;
        forceSum = interGraph.matrix[tempRoot][termID] * interGraph.matrix[termID][tempRoot];
        leafList = interGraph.termsGroup[tempRoot];
        for (i = 0, len = leafList.length; i < len; i += 1) {
            leaf = leafList[i];
            if (leaf == termID) {
                continue;
            }
            memberNum += 1;
            forceSum += interGraph.matrix[leaf][termID] * interGraph.matrix[termID][leaf];
            // if (tempForce > 0) {
            //     forceSum += tempForce;
            // } else {
                // forceSum -= interGraph.matrix[termID][termID] * interGraph.matrix[leaf][leaf];
            // }
        }
        if (!isGroup) {
            maxForceValue = forceSum / memberNum; //maxForceValue = forceSum;
            maxForceID = tempRoot;
            leafList = interGraph.forceData[termID];
            for (i = 0, len = leafList.length; i < len; i += 1) {
                leaf = leafList[i];
                if (interGraph.termsGroup.hasOwnProperty(leaf)) {
                    continue;
                } else {
                    forceNeighbour = interGraph.matrix[leaf][termID] * interGraph.matrix[termID][leaf];
                    if (forceNeighbour > maxForceValue) {
                        maxForceValue = forceNeighbour;
                        maxForceID = leaf;
                    }
                }
            }
        } else {
            forceDict[tempRoot] = forceSum / memberNum; //= forceSum;
        }
    }
    if (isGroup) {
        return forceDict;
    } else {
        maxForce = {rootID: maxForceID, value: maxForceValue};
        return maxForce;
    }
}

function buildDendrogram(interGraph) {
    var tempRoot, leaf, leafList, i, len, oneChild;
    interGraph.dendrogram = {};
    for (tempRoot in interGraph.termsGroup) {
        interGraph.dendrogram[tempRoot] = {};
        interGraph.dendrogram[tempRoot]["text"] = interGraph.nodes[tempRoot].text;
        interGraph.dendrogram[tempRoot]["index"] = tempRoot;
        interGraph.dendrogram[tempRoot]["degree"] = interGraph.nodes[tempRoot].degree;
        interGraph.dendrogram[tempRoot]["children"] = [];
        leafList = interGraph.termsGroup[tempRoot];
        for (i = 0, len = leafList.length; i < len; i += 1) {
            leaf = leafList[i];
            oneChild = {};
            oneChild["text"] = interGraph.nodes[leaf].text;
            oneChild["index"] = leaf;
            oneChild["degree"] = interGraph.nodes[leaf].degree;
            interGraph.dendrogram[tempRoot]["children"].push(oneChild);
        }
    }    
}

function getDendrogram(myData) {
    var myCluster, reLen, oneRoot, dendrogramResult;
    myCluster = myData.dendrogram;
    reLen = Object.keys(myCluster).length;
    if (reLen > 1) {
        dendrogramResult = {};
        dendrogramResult["text"] = " ";
        dendrogramResult["children"] = [];
    }
    for (oneRoot in myCluster) {
        if (reLen > 1) {
            dendrogramResult.children.push(myCluster[oneRoot]);
        } else {
            dendrogramResult = myCluster[oneRoot];
        }
    }
    return dendrogramResult;
}

function getGroupOriginOrder(interGraph, kind) {
    var tempRoot, leaf, leafList, i = 1, index, len;
    for (tempRoot in interGraph.termsGroup) {
        interGraph.nodes[tempRoot][kind] = i;
        leafList = interGraph.termsGroup[tempRoot];
        for (index = 0, len = leafList.length; index < len; index += 1) {
            leaf = leafList[index];
            interGraph.nodes[leaf][kind] = i;
        }
        i += 1;
    }
}

function regroupTerms(interGraphVersion2) {
    var tempRoot, leaf, leafList, i, len, maxForceRoot, maxForce, addNewRoot = true, groupNum;
    while(addNewRoot) {
        optimiseGroup(interGraphVersion2);
        addNewRoot = false;
        groupNum = Object.keys(interGraphVersion2.termsGroup).length;
        for (tempRoot in interGraphVersion2.termsGroup) {
            leafList = interGraphVersion2.termsGroup[tempRoot];
            i = 0;
            while (i < leafList.length) {
                leaf = leafList[i];
                maxForce = getAVGForceFromTermToGroups(leaf, tempRoot, interGraphVersion2, false);
                if (maxForce.value > 0 && maxForce.rootID != tempRoot) {
                    if (interGraphVersion2.termsGroup.hasOwnProperty(maxForce.rootID)) {
                        interGraphVersion2.termsGroup[maxForce.rootID].push(leaf);
                    } else {
                        if (maxForce.rootID != leaf) {
                            interGraphVersion2.termsGroup[maxForce.rootID] = [leaf];
                        } else {
                            console.log("find one");
                            interGraphVersion2.termsGroup[maxForce.rootID] = [];
                        }
                        addNewRoot = true;
                    }
                    leafList.splice(i, 1);
                } else {
                    i += 1;
                }
            }
        }
    }
    buildDendrogram(interGraphVersion2);
}

function getOrderGroupList(termsGroups) {
    var orderedList = [], i, tempRoot;
    for (tempRoot in termsGroups) {
        i = termsGroups[tempRoot].length;
        orderedList.push({rootID: tempRoot, groupSize: i});
    }
    orderedList.sort(function(a, b) { return a.groupSize - b.groupSize; });
    return orderedList;
}

function connectTwoForceDict(forceDict1, forceDict2) {
    var tempRoot;
    for (tempRoot in forceDict2) {
        forceDict1[tempRoot] += forceDict2[tempRoot];
    }
}

function getGroupCluster(groupRoot, interGraph) {
    var leaf, leafList, i, len, forceSumDict, tempForceDict, item, maxID, maxValue = 0;
    forceSumDict = getAVGForceFromTermToGroups(groupRoot, groupRoot, interGraph, true);
    leafList = interGraph.termsGroup[groupRoot];
    len = leafList.length;
    for (i = 0; i < len; i += 1) {
        leaf = leafList[i];
        tempForceDict = getAVGForceFromTermToGroups(leaf, groupRoot, interGraph, true);
        connectTwoForceDict(forceSumDict, tempForceDict);
    }
    for (item in forceSumDict) {
        if (forceSumDict[item] > maxValue) {
            maxID = item;
            maxValue = forceSumDict[item];
        }
    }
    if (maxValue == 0) {
        return -1;
    }
    return maxID;
}

function reduceGroups(minGroupSize, interGraphVersion3, isForDanG) {
    var groupSize, tempGroup, groupOrdered, leafList, i = 0;
    while (true) {
        groupSize = Object.keys(interGraphVersion3.termsGroup).length;
        if (isForDanG) {
            if (groupSize == 20) {
                getGroupOriginOrder(interGraphVersion3, "ogod");
            }
        }
        if (minGroupSize >= groupSize || i >= groupSize - 1) {
            break;
        }
        groupOrdered = getOrderGroupList(interGraphVersion3.termsGroup);
        groupToReduce = groupOrdered[i].rootID.toString();
        groupMaxForce = getGroupCluster(groupToReduce, interGraphVersion3);
        if (groupMaxForce != -1) {
            if (interGraphVersion3.matrix[groupToReduce][groupToReduce] > interGraphVersion3.matrix[groupMaxForce][groupMaxForce]) {
                tempGroup = groupToReduce;
                groupToReduce = groupMaxForce;
                groupMaxForce = tempGroup;
            }
            interGraphVersion3.termsGroup[groupMaxForce].push(groupToReduce);
            leafList = interGraphVersion3.termsGroup[groupToReduce];
            interGraphVersion3.termsGroup[groupMaxForce] = interGraphVersion3.termsGroup[groupMaxForce].concat(leafList);
            delete interGraphVersion3.termsGroup[groupToReduce];
            interGraphVersion3.dendrogram[groupMaxForce].children.push(interGraphVersion3.dendrogram[groupToReduce]);
            delete interGraphVersion3.dendrogram[groupToReduce];    
        } else {
            i += 1;
        }
    } 
}
