//for the databar visualisation
let urlbar = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
let reqbar = new XMLHttpRequest()
let databar
let valuesbar = []
let heightScalebar
let xScalebar
let xAxisScalebar
let yAxisScalebar
let widthbar = 800
let heightbar = 600
let paddingbar = 40
let svgbar = d3.select('#canvas1')

let drawCanvasbar = () => {
    svgbar.attr('width', widthbar)
    svgbar.attr('height', heightbar)
}
let generateScalesbar = () => {

    heightScalebar = d3.scaleLinear()
                    .domain([0,d3.max(valuesbar, (item) => {
                        return item[1]
                    })])
                    .range([0, heightbar - (2*paddingbar)])

    xScalebar = d3.scaleLinear()
                    .domain([0, valuesbar.length -1])
                    .range([paddingbar, widthbar - paddingbar])

    let datesArraybar = valuesbar.map((item) => {
        return new Date(item[0])
    })
    xAxisScalebar = d3.scaleTime()
    .domain([d3.min(datesArraybar), d3.max(datesArraybar)])
    .range([paddingbar, widthbar-paddingbar])

yAxisScalebar = d3.scaleLinear()
    .domain([0, d3.max(valuesbar, (item) => {
        return item[1]
    })])
    .range([heightbar - paddingbar, paddingbar ])
}
let drawBars =() => {

    let tooltipbar = d3.select('#bar')
                    .append('div')
                    .attr('id', 'tooltipbar')
                    .style('visibility', 'hidden')
                    .style('width', 'auto')
                    .style('height', 'auto')

    svgbar.selectAll('rect')
        .data(valuesbar)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('width', (widthbar - (2 * paddingbar)) / valuesbar.length)
        .attr('data-date', (item) => {
            return item[0]
        })
        .attr('data-gdp', (item) => {
            return item[1]
        })
        .attr('height', (item) => {
            return heightScalebar(item[1])
        })
        .attr('x', (item, index) => {
            return xScalebar(index)
        })
        .attr('y', (item) => {
            return (heightbar - paddingbar) - heightScalebar(item[1])
        })
        .on('mouseover', (item) => {
            tooltipbar.transition()
                .style('visibility', 'visible')

            tooltipbar.text(item[0])

            document.querySelector('#tooltipbar').setAttribute('data-date', item[0])
        })
        .on('mouseout', (item) => {
            tooltipbar.transition()
                .style('visibility', 'hidden')
        })        
}
let generateAxesbar = () => {

    let xAxisbar = d3.axisBottom(xAxisScalebar)
    let yAxisbar = d3.axisLeft(yAxisScalebar)

    svgbar.append('g')
        .call(xAxisbar)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0, ' + (heightbar-paddingbar) + ')')

    svgbar.append('g')
        .call(yAxisbar)
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + paddingbar + ', 0)')
        
}
    
reqbar.open('GET', urlbar, true)
reqbar.onload = () => {
    data = JSON.parse(reqbar.responseText)
    valuesbar = data.data
   
    drawCanvasbar()
    generateScalesbar()
    drawBars()
    generateAxesbar()
}
reqbar.send()

//for the heatmap visualisation
let urlheat = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'
let reqheat = new XMLHttpRequest()
let baseTempheat
let valuesheat =[]
let xScaleheat
let yScaleheat
let xAxisheat
let yAxisheat
let minYearheat 
let maxYearheat 
let widthheat = 1200
let heightheat = 600
let paddingheat = 60
let svgheat = d3.select('#canvasheat')
let tooltipheat = d3.select('#tooltipheat')
let generateScalesheat = () => {
    minYearheat = d3.min(valuesheat, (item) => {
        return item['year']
    })
    maxYearheat = d3.max(valuesheat, (item) => {
        return item['year']
    })
    xScaleheat = d3.scaleLinear()
    .domain([minYearheat, maxYearheat + 1])
    .range([paddingheat, widthheat - paddingheat])
    yScaleheat = d3.scaleTime()
                .domain([new Date(0,0,0,0, 0, 0, 0), new Date(0,12,0,0,0,0,0)])
                .range([paddingheat, heightheat - paddingheat])
}
let drawCanvasheat = () => {
    svgheat.attr('width', widthheat)
    svgheat.attr('height', heightheat)
}
let drawCellsheat = () => {  
    svgheat.selectAll('rect')
        .data(valuesheat)
        .enter()
        .append('rect')
        .attr('class','cell')
        .attr('fill', (item) => {
            let varianceheat = item['variance']
            if(varianceheat <= -1){
                return 'SteelBlue'
            }else if(varianceheat <= 0){
                return 'LightSteelBlue'
            }else if(varianceheat <= 1){
                return 'Orange'
            }else{
                return 'Crimson'
            }
        }) 
        .attr('data-year', (item) => {
            return item['year']
        })
        .attr('data-month', (item) => {
            return item['month'] - 1
        })
        .attr('data-temp', (item) => {
            return baseTempheat + item['variance']
        })
        .attr('height', (item)=> {
            return (heightheat - (2 * paddingheat)) / 12
        })
        .attr('y', (item) => {
            return yScaleheat(new Date(0, item['month']-1, 0, 0, 0, 0, 0))
        })
        .attr('width', (item) => {
            let minYearheat = d3.min(valuesheat, (item) => {
                return item['year']
            })
            
            let maxYearheat = d3.max(valuesheat, (item) => {
                return item['year']
            })
        
            let yearCountheat = maxYearheat - minYearheat
        
            return (widthheat - (2 * paddingheat)) / yearCountheat
        })
        .attr('x', (item) => {
            return xScaleheat(item['year'])
        })
        .on('mouseover', (item) => {
            tooltipheat.transition()
                .style('visibility', 'visible')
            
            let monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"]
        
            tooltipheat.text(item['year'] + ' ' + monthNames[item['month'] -1 ] + ' : ' + item['variance'])
        })
        .on('mouseout', (item) => {
            tooltipheat.transition()
                .style('visibility', 'hidden')
        })      
}
let generateAxesheat = () => {  
    let xAxisheat = d3.axisBottom(xScaleheat)
                    .tickFormat(d3.format('d'))
    svgheat.append('g')
        .call(xAxisheat)
        .attr('id','x-axis')
        .attr('transform', 'translate(0, ' + (heightheat-paddingheat) + ')') 
    let yAxisheat = d3.axisLeft(yScaleheat).tickFormat(d3.timeFormat('%B'))
    svgheat.append('g')
            .call(yAxisheat)
            .attr('id', 'y-axis')
            .attr('transform', 'translate(' + paddingheat + ', 0)')
}
reqheat.open('GET', urlheat, true)
reqheat.onload = () => {
    let data = JSON.parse(reqheat.responseText)
    baseTemp = data.baseTemperature
    valuesheat = data.monthlyVariance
    console.log(baseTemp)
    console.log(valuesheat)
    drawCanvasheat()
    generateScalesheat()
    drawCellsheat()
    generateAxesheat()
}
reqheat.send()

// for tree visualisation
let movieDataUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json'

let movieData

let canvastree = d3.select('#canvastree')
let tooltiptree = d3.select('#tooltiptree')

let drawTreeMap = () => {
    let hierarchy = d3.hierarchy(movieData, 
        (node) => {
            return node['children']
        }
    ).sum(
        (node) => {
            return node['value']
        }
    ).sort(
        (node1, node2) => {
            return node2['value'] - node1['value']
        } 
    )
    console.log(hierarchy);
    d3.treemap()
      .size([1000,600])
      (hierarchy)
  
  let movieTiles = hierarchy.leaves()
  console.log(movieTiles)
  let blocktree = canvastree.selectAll('g')
                .data(movieTiles)
                .enter()
                .append('g')
                .attr('transform', (movie) => {
	                return 'translate (' + movie['x0'] + ', ' + movie['y0'] +')'
	            })

blocktree.append('rect')
      .attr('class', 'tile')
      .attr('fill', (movie) => {
        let category = movie['data']['category']
        if(category === 'Action'){
            return '#737CA1'
        }else if(category === 'Drama'){
            return '#00FFFF'
        }else if(category === 'Adventure'){
            return '#41A317'
        }else if(category === 'Family'){
            return '#FFF380'
        }else if(category === 'Animation'){
            return '#FFEBCD'
        }else if(category === 'Comedy'){
            return 'khaki'
        }else if(category === 'Biography'){
            return 'tan'
        }
    })
    .attr('data-name', (movie) => {
        return movie['data']['name']
    })
    .attr('data-category', (movie) => {
        return movie['data']['category']
    })
    .attr('data-value', (movie) => {
        return movie['data']['value']
    })
    .attr('width', (movie) => {
        return movie['x1'] - movie['x0']
    })
    .attr('height', (movie) => {
        return movie['y1'] - movie['y0']
    })
    .on('mouseover', (movie) => {
        tooltiptree.transition()
                .style('visibility', 'visible')
                console.log(movie);
    
        let movieData = movie['data']
    
        tooltiptree.text(
            movieData['name'] + ' : $' + movieData['value']
        )
    })
    .on('mouseout', (movie) => {
        tooltiptree.transition()
                .style('visibility', 'hidden')
    })
    blocktree.append('text')
        .text((movie) => {
            return movie['data']['name']
        })
        .attr('x', 5)
        .attr('y', 30)

}
d3.json(movieDataUrl).then(
    (data, error) => {
        if(error){
            console.log(error)
        } else {
            movieData = data
            console.log(movieData)
            drawTreeMap()
        }
    }
)

//scatterplot visualisation
let urlscatter = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
let reqscatter = new XMLHttpRequest()
let valuesscatter =[]
let xScalescatter
let yScalescatter
let xAxisscatter
let yAxisscatter
let widthscatter = 800
let heightscatter = 600
let paddingscatter = 40
let svgscatter = d3.select('#canvasscatter')
let tooltipscatter = d3.select('#tooltipscatter')
let generateScalesscatter = () => {
    
    xScalescatter = d3.scaleLinear()
                        .domain([d3.min(valuesscatter, (item) => {
                            return item['Year']
                        }) - 1 , d3.max(valuesscatter, (item) => {
                            return item['Year']
                        }) + 1])
                        .range([paddingscatter, widthscatter-paddingscatter])

    yScalescatter = d3.scaleTime()
                        .domain([d3.min(valuesscatter, (item) => {
                            return new Date(item['Seconds'] * 1000)
                        }), d3.max(valuesscatter, (item) => {
                            return new Date(item['Seconds'] * 1000)
                        })])
                        .range([paddingscatter, heightscatter-paddingscatter])

}
let drawPointsscatter = () => {

    svgscatter.selectAll('circle')
            .data(valuesscatter)
            .enter()
            .append('circle')
            .attr('class', 'dot')
            .attr('r', '5')
            .attr('data-xvalue', (item) => {
                return item['Year']
            })
            .attr('data-yvalue', (item) => {
                return new Date(item['Seconds'] * 1000)
            })
          .attr('cx', (item) => {
              return xScalescatter(item['Year'])
          })         
            .attr('cy', (item) => {
                return yScalescatter(new Date(item['Seconds'] * 1000))
            })
            .attr('fill', (item) => {
                if(item['URL'] === ""){
                    return 'green'
                }else{
                    return 'red'
                }
            })
            .on('mouseover', (item) => {
                tooltipscatter.transition()
                    .style('visibility', 'visible')
                
                if(item['Doping'] != ""){
                    tooltipscatter.text(item['Year'] + ' - ' + item['Name'] + ' - ' + item['Time'] + ' - ' + item['Doping'])
                }else{
                    tooltipscatter.text(item['Year'] + ' - ' + item['Name'] + ' - ' + item['Time'] + ' - ' + 'No Allegations')
                }
                
                tooltipscatter.attr('data-year', item['Year'])
            })
            .on('mouseout', (item) => {
                tooltipscatter.transition()
                    .style('visibility', 'hidden')
            })
} 
let generateAxesscatter = () => {

    xAxisscatter = d3.axisBottom(xScalescatter)
                .tickFormat(d3.format('d'))
                

    yAxisscatter = d3.axisLeft(yScalescatter)
                .tickFormat(d3.timeFormat('%M:%S'))


    svgscatter.append('g')
        .call(xAxisscatter)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0, ' + (heightscatter-paddingscatter) +')')

    svgscatter.append('g')
        .call(yAxisscatter)
        .attr('id', 'y-axis')
        .attr('transform','translate(' + paddingscatter + ', 0)')
}
let drawCanvasscatter = () => {
    svgscatter.attr('width', widthscatter)
    svgscatter.attr('height', heightscatter)
}
reqscatter.open('GET', urlscatter, true)
reqscatter.onload = () => {
    valuesscatter = JSON.parse(reqscatter.responseText)
    console.log(valuesscatter)
    drawCanvasscatter()
    generateScalesscatter()
    drawPointsscatter()
    generateAxesscatter()
}
reqscatter.send()
//chloropleth
let countyURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'
let educationURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'

let countyData
let educationData

let canvaschloro = d3.select('#canvaschloro');
let tooltipchloro = d3.select('#tooltipchloro');

let drawMapchloro =() =>{
    canvaschloro.selectAll('path').data(countyData).enter().append('path').attr('d',d3.geoPath()).attr('class','county')
    .attr('fill',(countyDataItem)=>{
        let id = countyDataItem['id']
        let county = educationData.find((item)=>
        {
            return item['fips'] === id
        })
        let percentage  = county['bachelorsOrHigher']
        if(percentage<=15){
            return 'tomato';
        }
        else if(percentage<=30)
        {
            return 'orange';
        }
        else if(percentage<=45)
        {
            return 'lightgreen';
        }
        else 
        {
            return 'limegreen';
        }
        })
    .attr('data-fips',(countyDataItem)=>{
        return countyDataItem['id'];
    })
    .attr('data-education',(countyDataItem)=>{
        let id = countyDataItem['id']
        let county = educationData.find((item)=>
        {
            return item['fips'] === id
        })
        let percentage  = county['bachelorsOrHigher']
        return percentage

    })
    .on('mouseover',(countyDataItem)=>{
        tooltipchloro.transition().style('visibility','visible')
        let fips = countyDataItem['id']
    let county = educationData.find((county) => {
        return county['fips'] === fips
    })

    tooltipchloro.text(county['fips'] + ' - ' + county['area_name'] + ', ' + 
        county['state'] + ' : ' + county['bachelorsOrHigher'] + '%');
    tooltipchloro.attr('data-education',county['bachelorsOrHigher']);
    })
    .on('mouseout', (countyDataItem) => {
        tooltipchloro.transition()
                .style('visibility', 'hidden')
    })
    }
    


d3.json(countyURL).then(
    (data, error) => {
        if(error){
            console.log(error)
        }else{
            countyData = topojson.feature(data,data.objects.counties).features;
            console.log('County Data')
            console.log(countyData)

            d3.json(educationURL).then(
                (data, error) => {
                    if(error){
                        console.log(error)
                    }
                    else{
                        educationData = data
                        console.log('Education Data')
                        console.log(educationData)
                        drawMapchloro()
                    }
                }
            )

        }
    }
)
