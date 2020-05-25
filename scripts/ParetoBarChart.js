class ParetoBarChart {

    constructor(element, config, file, d3js) {
        this.element=element;
        this.cfg = {
            x: 0,
            y: 0,
            width: 400,
            height: 400,
            barColor: '#1f77b4',
            lineColor: 'red',
            margin: {top: 50, right: 50, bottom: 50, left: 50},
            barPadding: 0.1
        };
        this.loadConfig(config);
        this.loadDataAndDraw(file, d3js);
    }
    
    loadConfig(config) {
        if ('undefined' !== typeof config) {
            for (let i in config) {
                if ('undefined' !== typeof config[i]) {
                    this.cfg[i] = config[i];
                }
            }
        }    
    }    
    
    loadDataAndDraw(file, d3) {
        d3.csv(file)
          .then((d) => {this.draw(d, d3);});
          //.catch((error) => {console.error('can not read file: ' + file + ' ' + new Error().stack);});        
    }
    
    getX() {
        return this.cfg.x;
    }
    
    getY() {
        return this.cfg.y;
    }
    
    getWidth() {
        return this.cfg.width;
    } 
    
    getHeight() {
        return this.cfg.height;
    } 
            
    getBarColor() {
        return this.cfg.barColor;
    }
    
    getLineColor() {
        return this.cfg.lineColor;
    }    
    
    getMargin() {
        return this.cfg.margin;
    }
    
    getBarPadding() {
        return this.cfg.barPadding;
    }     
    
    draw(data, d3) {
        
        let x = this.getX();
        let y = this.getY();
        let barColor = this.getBarColor();
        let lineColor = this.getLineColor();
        let margin = this.getMargin();
        let w = this.getWidth();
        let h = this.getHeight();
        let barPadding = this.getBarPadding();
        
        let total = d3.sum(data, function(d) {return d.Value});
        
        for(let i = 0; i < data.length; i++){
            data[i].Value = +data[i].Value;
            if(i > 0){
               data[i]['RelativeValue'] = data[i].Value + data[i - 1].RelativeValue;
            }else{
               data[i]['RelativeValue'] = data[i].Value;
            }
        }
        
        for(let i = 0; i < data.length; i++){
            data[i]['RelativePercent'] = parseFloat(data[i]['RelativeValue'] / total).toFixed(2);
        }              
        
        const xScale = d3.scaleBand()
          .domain(data.map(function(d) {return d.Params}))
          .range([margin.left, w - margin.right])
          .padding(barPadding);
  
        const yScale = d3.scaleLinear()
          .domain([0, d3.max(data, function(d) {return d.Value})])
          .range([h - margin.bottom, margin.top]);
          
        const yPercent = d3.scaleLinear()
          .domain([0, 1])
          .range([h - margin.bottom, margin.top]);          
   
        let svg = d3.select(this.element)
                    .append('svg')
                    .attr('width', w)
                    .attr('height', h)
                    .attr('transform', 'translate(' + x + ',' + y + ')');
      
        svg.selectAll('g')
           .data(data)
           .enter()
           .append('rect')
           .attr('x', function(d) {return xScale(d.Params);})
           .attr('y', function(d) {return yScale(d.Value);})
           .attr('width', xScale.bandwidth())
           .attr('height', function(d) {return h - margin.bottom - yScale(d.Value);})
           .attr('fill', barColor);
                      
        let lineGenerator = d3.line()
                              .x(function(d) {return xScale(d.Params) + xScale.bandwidth() / 2;})
                              .y(function(d){return yPercent(d.RelativePercent)})
                              .curve(d3.curveNatural);
                      
        let line = svg.append('path')
                      .datum(data)
                      .attr('d', lineGenerator)
                      .attr('class', 'line')
                      .attr('stroke', lineColor);                      

        svg.append('g')
           .attr('class', 'axis')
           .attr('transform', 'translate(0, ' + (h - margin.bottom) + ')')
           .call(d3.axisBottom(xScale).tickSizeOuter(0));
          
        svg.append('g')
           .attr('class', 'axis')
           .attr('transform', 'translate(' + margin.left + ', 0)')
           .call(d3.axisLeft(yScale));
           
        svg.append('g')
           .attr('class', 'axis')
           .attr('transform', 'translate(' + (w - margin.right) + ', 0)')
           .call(d3.axisRight(yPercent));           
    }
}