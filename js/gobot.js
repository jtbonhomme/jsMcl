(function(global) {
  'use strict';

    var mclCtx = global.mclCtx;

    function round(n) {
        return Math.round(n * 1000) * .0001;
    };

    function normal_random(mean, variance) {
        if (mean == undefined)
            mean = 0.0;
        if (variance == undefined)
            variance = 1.0;
        var V1, V2, S;
        do {
            var U1 = Math.random();
            var U2 = Math.random();
            V1 = 2 * U1 - 1;
            V2 = 2 * U2 - 1;
            S = V1 * V1 + V2 * V2;
        } while (S > 1);
        
        X = Math.sqrt(-2 * Math.log(S) / S) * V1;
        //  Y = Math.sqrt(-2 * Math.log(S) / S) * V2;
        X = mean + Math.sqrt(variance) * X;
        //  Y = mean + Math.sqrt(variance) * Y ;
        return X;
    }
    Math.nrand = function(range) {
        return Math.floor(Math.random()* (range + 1));
    };

    function drawLine(begin, end, color, lineWidth) {
        mclCtx.save();
        mclCtx.beginPath();
        mclCtx.moveTo(begin.x, begin.y);
        mclCtx.lineTo(begin.x, begin.y);
        mclCtx.lineTo(end.x, end.y);
        mclCtx.lineWidth = lineWidth || 3;
        mclCtx.strokeStyle = color || 'rgb(255, 45, 251)';
        mclCtx.stroke();
        mclCtx.closePath();
        mclCtx.restore();
    }

    function drawLine2(begin, angle, length, color, lineWidth) {
        angle = ((270 + angle) % 360);
        var end = {
            'x': (begin.x + length * Math.cos(angle * Math.PI / 180)),
            'y': (begin.y + length * Math.sin(angle * Math.PI / 180))
        };
        mclCtx.save();
        mclCtx.beginPath();
        mclCtx.moveTo(begin.x, begin.y);
        mclCtx.lineTo(begin.x, begin.y);
        mclCtx.lineTo(end.x, end.y);
        mclCtx.lineWidth = lineWidth || 3;
        mclCtx.strokeStyle = color || 'rgb(255, 45, 251)';
        mclCtx.stroke();
        mclCtx.closePath();
        mclCtx.restore();
    }

    function drawCircle(center, color, r) {
        mclCtx.save();
        mclCtx.beginPath();
        mclCtx.lineWidth = 0;
        mclCtx.fillStyle = color || 'rgba(255, 55, 55, 1)';
        mclCtx.arc(center.x, center.y, (r || 4), 0, 2 * Math.PI, false);
        mclCtx.fill();
        mclCtx.closePath();
        mclCtx.restore();
    }

    function drawChart(data1, data2) {
        console.log("data1: "+data1);
        console.log("data2: "+data2);
    }
    // INTERSECTIONS
    // =============================================================================
    function lineIntersect(p1, p2, p3, p4) {
        // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
        var denominator, a, b, numerator1, numerator2, result = {
            x: null,
            y: null,
        };
        denominator = ((p4.y - p3.y) * (p2.x - p1.x)) - ((p4.x - p3.x) * (p2.y - p1.y));
        if (denominator == 0) {
            return false;
        }
        a = p1.y - p3.y;
        b = p1.x - p3.x;
        numerator1 = ((p4.x - p3.x) * a) - ((p4.y - p3.y) * b);
        numerator2 = ((p2.x - p1.x) * a) - ((p2.y - p1.y) * b);
        a = numerator1 / denominator;
        b = numerator2 / denominator;
        
        result.x = p1.x + (a * (p2.x - p1.x));
        result.y = p1.y + (a * (p2.y - p1.y));
        
        if ((a > 0 && a < 1) && (b > 0 && b < 1)) 
            return new Point(result.x, result.y);
        else 
            return false;
        
    };
/*    isOnLine = function(p1, p2, p3, tolerate){
        tolerate = tolerate || 7;
        var slope = (p3.y - p2.y) / (p3.x - p2.x);
        var y = slope * p1.x + p2.y;
        if((y <= p1.y+tolerate && y >= p1.y-tolerate) && (p1.x >= p2.x && p1.x <= p3.x)) {
            return true;
        }
        return false;
    };*/

    // BOX MULLER
    // =============================================================================
    var BoxMuller = {
        random: function(mu, sigma){
            return mu + round(Math.sqrt(-2.0*Math.log(Math.random()))*
                              Math.cos(2*Math.PI*Math.random())*sigma);
        }
    };
    // GAUSSIAN
    // =============================================================================
    var Gaussian = {
        weight: //function(mean, std, x){
        function(mu, sigma, x){
            
            return (1 / (sigma * Math.sqrt(2.0 * Math.PI))) * Math.exp(-0.5 * Math.pow(((x - mu) / sigma), 2));
            
            //var constant = 1;//1/(std*Math.sqrt(2*Math.PI));
            //var exponent = (-1*(x - mean)*(x - mean))/(2*std*std);
            //return Math.floor(constant*Math.exp(exponent)*1000)*.0001;
            //return round(constant*Math.exp(exponent));
        }
    };
    // POINT
    // =============================================================================
    var Point = new Class({
        x: 0,
        y: 0,
        init: function(x, y) {
            this.x = x;
            this.y = y;
        },
        toString: function() {
            return '[' + this.x + ',' + this.y + ']';
        }
    });
    // MAP
    // =============================================================================
    var Map = new Class({
        coordinates: [],
        init: function(map) {
            this.coordinates = [];
            switch (map) {
                case '1':
                    this.coordinates.push(new Point(10, 10));
                    this.coordinates.push(new Point(630, 10));
                    this.coordinates.push(new Point(630, 350));
                    this.coordinates.push(new Point(10, 350));
                    this.coordinates.push(new Point(10, 10));
                    break;
                case '2':
                    this.coordinates.push(new Point(10, 10));
                    this.coordinates.push(new Point(130, 10));
                    this.coordinates.push(new Point(130, 160));
                    this.coordinates.push(new Point(430, 160));
                    this.coordinates.push(new Point(430, 10));
                    this.coordinates.push(new Point(630, 10));
                    this.coordinates.push(new Point(630, 350));
                    this.coordinates.push(new Point(10, 350));
                    this.coordinates.push(new Point(10, 10));
                    break;
                case '3':
                    this.coordinates.push(new Point(10, 10));
                    this.coordinates.push(new Point(415, 10));
                    this.coordinates.push(new Point(415, 230));
                    this.coordinates.push(new Point(425, 230));
                    this.coordinates.push(new Point(425, 10));
                    this.coordinates.push(new Point(630, 10));
                    this.coordinates.push(new Point(630, 350));
                    this.coordinates.push(new Point(225, 350));
                    this.coordinates.push(new Point(225, 120));
                    this.coordinates.push(new Point(215, 120));
                    this.coordinates.push(new Point(215, 350));
                    this.coordinates.push(new Point(10, 350));
                    this.coordinates.push(new Point(10, 10));
                    break;
            }
            console.log('CREATED MAP');
            document.addEventListener("Update", bind(this, this.update), false);
            document.addEventListener("Draw", bind(this, this.draw), false);
        },
        update: function() {},
        draw: function() {
            for(var i in this.coordinates) {
                if(i>0)
                    drawLine(this.coordinates[i-1], this.coordinates[i], '#111', 3);
            };
        }
    });

    // SENSOR
    // =============================================================================
    var Sensor = Class({
        ID: 0,
        size: 0,
        angle: 0,
        range: 0,
        noise: 0,
        distance: 0,
        marker: 0,
        intersection: 0,
        totalAngle: 0,
        init: function(ID, size, angle, range, noise) {
            this.ID = ID;
            this.size = size;
            this.angle = (360 + angle) % 360;
            this.range = range;
            this.noise = noise;
            this.distance = 0;
            this.intersection = new Point(0, 0);
        },
        measure: function() {
            //return distance = range - (noise(noiseVal += noiseScale) * 2);
            //this.distance = this.range;
            this.distance = 0;
            console.log('ROBOT', robot.x, robot.y, robot.angle);
            totalAngle = (360 + (this.angle + robot.angle)) % 360;
            
            console.log('total angle', (totalAngle));
            this.marker = new Point(
                (robot.x + this.range * Math.sin(totalAngle * Math.PI / 180)),
                (robot.y - this.range * Math.cos(totalAngle * Math.PI / 180))
            );
            
            // laser
            //drawLine(robot, this.marker, 'rgb(0,255,0)');
            drawLine(robot, this.marker, 'rgba(246, 66, 36, .5)', 3);
            
            console.log('laser', robot.x, robot.y, this.marker.x, this.marker.y);
            //var marker = this.marker;
            var distance = this.range;
            for (var i in map.coordinates) {
                var prev = map.coordinates[i - 1];
                var point = map.coordinates[i];
                if (!prev || !point)
                    continue;
                
                var int = lineIntersect(robot, this.marker, prev, point);
                if (!int)
                    continue;
                
                var d = Math.abs(Math.sqrt(Math.pow(robot.x - int.x, 2)
                                           + Math.pow(robot.y - int.y, 2)));
                if (d > distance)
                    continue;
                
                drawLine(prev, point);
                
                this.intersection = int;
                this.distance = distance = round(d);
                console.log('distance: ' + this.distance);
                
            }
            console.log('angle', totalAngle);
            console.log('distance', this.distance);
            
            // UPDATE PARTICLES
            particles.sense(this.ID, this.angle, this.distance);
            particles.sense(this.ID, this.angle, this.distance);
            return this.distance == this.range ? 0 : BoxMuller.random(this.distance, this.noise);// = range;
        },
        draw: function(x, y, measuring) {
            mclCtx.save();
            mclCtx.beginPath();
            mclCtx.fillStyle = 'rgb(246, 66, 36)';
            
            mclCtx.translate(x, y);
            //mclCtx.translate(100, 100);
            //mclCtx.rotate(this.angle * Math.PI / 180);
            mclCtx.rotate((this.angle + robot.angle) * Math.PI / 180);
            mclCtx.moveTo(-this.size * .5, -this.size * .5);
            mclCtx.lineTo(-this.size * .5, -this.size * .5);
            mclCtx.lineTo(this.size * .5, -this.size * .5);
            mclCtx.lineTo(this.size * .5, this.size * .5);
            mclCtx.lineTo(-this.size * .5, this.size * .5);
            mclCtx.fill();
            mclCtx.closePath();
            mclCtx.restore();
            
            //mclCtx.translate(this.x + x, this.y + y);
            //mclCtx.rotate((this.angle + robot.angle) * Math.PI / 180);
            //mclCtx.fillRect(115, 115, 10, 10)
            //quad(-5, -5, 5, -5, 5, 5, -5, 5);
            
            if (measuring) {
                console.log('angle', robot.angle, this.angle);
                this.measure();
                mclCtx.save();
                mclCtx.beginPath();
                mclCtx.fillStyle = 'rgba(46, 166, 36, .9)';
                mclCtx.translate(x, y);
                mclCtx.rotate((this.angle + robot.angle) * Math.PI / 180);
                mclCtx.moveTo(-1, 0);
                mclCtx.lineTo(-1, 0);
                mclCtx.lineTo(1, 0);
                mclCtx.lineTo(1, -this.distance);
                mclCtx.lineTo(-1, -this.distance);
                mclCtx.fill();
                mclCtx.closePath();
                mclCtx.restore();
                console.log('measuring', distance);
                console.log('intersection', intersection.x, intersection.y);
            }
            
            if (this.marker) {
                mclCtx.save();
                mclCtx.beginPath();
                mclCtx.lineWidth = 0;
                mclCtx.fillStyle = 'rgba(246, 66, 36, .5)';
                mclCtx.arc(this.marker.x, this.marker.y, 4, 0, 2 * Math.PI, false);
                mclCtx.fill();
                mclCtx.closePath();
                mclCtx.restore();
            }
            if (this.intersection) {
                mclCtx.save();
                mclCtx.beginPath();
                mclCtx.lineWidth = 0;
                mclCtx.fillStyle = 'rgba(46, 166, 36, .5)';
                mclCtx.arc(this.intersection.x, this.intersection.y, 4, 0, 2 * Math.PI, false);
                mclCtx.fill();
                mclCtx.closePath();
                mclCtx.restore();
            }
        }
    });


    // ROBOT
    // =============================================================================
    var Robot = new Class({
        sensors: [],
        size: 0,
        x: 0,
        y: 0,
        angle: 0,
        speed: 0,
        noise: 0,
        sensorMeasuring: 0,
        p_cache: .5,
        init: function(size, x, y, angle, speed, noise) {
            this.size = size;
            this.x = x;
            this.y = y;
            this.angle = angle || 0;
            this.speed = speed || 5;
            this.noise = noise || 0;
            
            
            document.addEventListener("Update", bind(this, this.update), false);
            document.addEventListener("Draw", bind(this, this.draw), false);
        },
        addSensor: function(sensor) {
            this.sensors.push(sensor);
        },
        removeAllSensors: function() {
            this.sensors = [];
        },
        readSensors: function() {
            this.sensorMeasuring = 1;
        },
        stopSensors: function() {
            this.sensorMeasuring = 0;
        },
        checkTheWall: function(target){
/*            for (var i in map.coordinates) {
                var prev = map.coordinates[i - 1];
                var point = map.coordinates[i];
                if (!prev || !point)
                    continue;
                var int = lineIntersect(robot, target, prev, point);
                if(int)
                    return true;            
            }
*/
            return false;
        },
        go: function(step) {
            var target = new Point( 
                this.x + BoxMuller.random(step, robot.noise) * Math.sin(this.angle * Math.PI / 180),
                this.y + BoxMuller.random(step, robot.noise) * -Math.cos(this.angle * Math.PI / 180)
            );
            if(!this.checkTheWall(target)){
                this.x = target.x;
                this.y = target.y;
            }
        },
        turn: function(angle) {
            console.log('* angle: ' + this.angle);
            this.angle += BoxMuller.random(angle, robot.noise);
            this.angle = (360 + (this.angle)) % 360;
            
        },
        move: function(x, y, angle) {
            this.x = x;
            this.y = y;
            this.angle = angle;
            //display();
        },
        update: function() {
            if (key.space === 'down')
                this.readSensors();
            else if(key.space === 'up')
                this.stopSensors();
            
            if (key.up === 'down') 
                this.go(this.speed);
            
            if (key.down === 'down')
                this.go(-this.speed);
            
            if (key.left === 'down')
                this.turn(-this.speed);
            
            if (key.right === 'down')
                this.turn(this.speed);
        },
        draw: function() {
            mclCtx.save();
            mclCtx.beginPath();
            mclCtx.fillStyle = "rgb(17, 136, 221)";
            mclCtx.translate(this.x, this.y);
            mclCtx.rotate(this.angle * Math.PI / 180);
            mclCtx.moveTo(0, -this.size * .5);
            mclCtx.lineTo(0, -this.size * .5);
            mclCtx.lineTo(-this.size * .5, this.size * .5);
            mclCtx.lineTo(this.size * .5, this.size * .5);
            mclCtx.fill();
            //mclCtx.fillRect(0, 0, 10, 10);
            mclCtx.closePath();
            mclCtx.restore();
            // display sensors
            var x = this.x, y = this.y, sensorMeasuring = this.sensorMeasuring;
            this.sensors.forEach(function(sensor) {
                sensor.draw(x, y, sensorMeasuring);
            });
        },
        toString: function(){
            return '[' + this.x + ',' + this.y + ']';
        }
    });

    // PARTICLE
    // =============================================================================
    var Particle = new Class({
        x: 0,
        y: 0,
        angle: 0,
        weight: 1,
        probability: 1,
        size: 5, 
        sensors: [],
        totalAngle: 0,
        init: function(x, y, angle, weight, probability) {
            this.x = x; 
            this.y = y; 
            this.angle = angle; 
            this.weight = weight; 
            this.probability = probability; 
            
            document.addEventListener("Update", bind(this, this.update), false);
            document.addEventListener("Draw", bind(this, this.draw), false);
            
        },
        calculate: function(){
            this.computeWeights();
        },
        addSensor: function(i, angle, range, noise) {
            this.sensors[i] = {'angle': angle, 'range': range, 'noise':noise, 'distance':0};
            console.log('SENSORS', i, angle, range);
        },
        getDistance: function(sensor) {
            
            sensor.distance = 0;
            console.log('ROBOT', robot.x, robot.y, robot.angle);
            totalAngle = (360 + (this.angle + sensor.angle)) % 360;
            
            console.log('total angle', (totalAngle));
            sensor.marker = new Point(
                (this.x + sensor.range * Math.sin(totalAngle * Math.PI / 180)),
                (this.y - sensor.range * Math.cos(totalAngle * Math.PI / 180))
            );
            
            var marker = sensor.marker;
            var distance = sensor.range;
            for (var i in map.coordinates) {
                var prev = map.coordinates[i - 1];
                var point = map.coordinates[i];
                if (!prev || !point)
                    continue;
                
                var int = lineIntersect(this, marker, prev, point);
                if (!int)
                    continue;
                
                var d = Math.abs(Math.sqrt(Math.pow(this.x - int.x, 2)
                                           + Math.pow(this.y - int.y, 2)));
                if (d > distance)
                    continue;
                
                sensor.intersection = int;
                sensor.distance = distance = round(d);
                console.log('sensor distance: ' + sensor.distance);
                
            }
            return sensor.distance == sensor.range ? 0 : sensor.distance;
        },
        computeWeights: function(){
            for(var i in this.sensors){
                this.sensors[i].distance = this.getDistance(this.sensors[i]);
                this.weight *= Gaussian.weight(robot.sensors[i].distance, 1, this.sensors[i].distance);
                console.log('DISTANCE '+ this.sensors[i].distance);
            }
        },
        checkTheWall: function(target){
/*            for (var i in map.coordinates) {
                var prev = map.coordinates[i - 1];
                var point = map.coordinates[i];
                if (!prev || !point)
                    continue;
                var int = lineIntersect(this, target, prev, point);
                if(int)
                    return true;            
            }
*/
            return false;
        },
        go: function(step) {
            var target = new Point( 
                this.x + BoxMuller.random(step, robot.noise) * Math.sin(this.angle * Math.PI / 180),
                this.y + BoxMuller.random(step, robot.noise) * -Math.cos(this.angle * Math.PI / 180)
            );
            if(!this.checkTheWall(target)){
                this.x = target.x;
                this.y = target.y;
            }
        },
        turn: function(angle) {
            this.angle += BoxMuller.random(angle, robot.noise);
            this.angle = (360 + (this.angle)) % 360;
        },
        update: function() {
            if (key.up === 'down') 
                this.go(robot.speed);
            
            if (key.down === 'down') 
                this.go(-robot.speed);
            
            if (key.left === 'down') 
                this.turn(-robot.speed);
            
            if (key.right === 'down') 
                this.turn(robot.speed);
        },
        draw: function() {
            drawLine2(this, this.angle, this.size+1, 'rgba(0,155,155,.8)', 1);
            //drawCircle(this, 'rgba(255,155,155,'+this.weight+')', this.size)
            drawCircle(this, 'rgba(255,155,155,.5)', this.size)
        },
        toString: function(){
            return '[' + this.x + ',' + this.y + ']';
        }
    });

    var Particles = new Class({
        width: 0,
        height: 0,
        list: [],
        percent: 10,
        init: function(width, height, count, percent) {
            this.width = width;
            this.height = height;
            this.percent = percent;
            for(var i=0; i < count; i++){
                this.list[i] = new Particle(
                    //120 + i*15,//Math.nrand(width),
                    //90 + i*5,//Math.nrand(height),
                    //0,//Math.nrand(360),
                    Math.nrand(width),
                    Math.nrand(height),
                    Math.nrand(360),
                    1,
                    1 / count
                );
                for(var j in robot.sensors)
                    if(robot.sensors[j] instanceof Sensor)
                        this.list[i].addSensor(j, robot.sensors[j].angle, robot.sensors[j].range, robot.sensors[j].distance, robot.sensors[j].noise);
            }
            
            document.addEventListener("Update", bind(this, this.update), false);
        },
        sense: function(ID, angle, distance) {},
        normalizeWeights: function(){
            var totalWeight = 0;
            for(var i in this.list)
                if(this.list[i] instanceof Particle)
                    totalWeight += this.list[i].weight;
            totalWeight == round(totalWeight);
            console.log('TOTAL WEIGHT: ' + totalWeight);
            console.log('PARTICLE COUNT: ' + this.list.length);
            var highWeightParticle = {'weight':0};
            for(var i in this.list)
                if(this.list[i] instanceof Particle){
                    this.list[i].weight = this.list[i].weight / totalWeight;
                    if(highWeightParticle.weight < this.list[i].weight)
                        highWeightParticle = this.list[i];
                    console.log('PARTICLE Normalize Weight: ' +  this.list[i].weight);
                }
            
            // sort particles
            this.list.sort(function(a, b) {return b.weight - a.weight});
            
            // resample from top "q" in particles 
            var q = this.list.length * this.percent * .01 >> 0;
            
            // move particles
            for(var i = q; i < this.list.length; i++)
                if(this.list[i] instanceof Particle){
                    this.list[i].x = BoxMuller.random(this.list[i-q].x, 20);
                    this.list[i].y = BoxMuller.random(this.list[i-q].y, 20);
                    this.list[i].angle = BoxMuller.random(this.list[i-q].angle, 20);
                }
            
            // visualitaion
            // sort particles
            this.list.sort(function(a, b) {return b.weight - a.weight});
            // calculate with top 1 particle
            var d = Math.abs(Math.sqrt(Math.pow(robot.x - this.list[0].x, 2)
                                       + Math.pow(robot.y - this.list[0].y, 2)));
            drawLine(robot, this.list[0], '#0f0', 1);
            console.log('distance: ' + d);
            
            // visualiton data
            data1.push([++iteration, d]);
            data2.push([iteration, this.list[0].weight]);
            drawChart(data1, data2);
        },
        update: function() {
            if (key.space === 'up') {
                //this.readSensors();
                console.log('space up','calculate');
                key.space = 0;
                for(var i in this.list)
                    if(this.list[i] instanceof Particle){
                        this.list[i].calculate();
                    }
                this.normalizeWeights();
            }
        }
    });





    // =============================================================================
    // =============================================================================
    // /MONTE CARLO
    // =============================================================================
    // =============================================================================
    /*
    function MCL(cell, u, z) {
        
        if (u)
            cell.p = move(cell.p, u);
        if (z)
            sense(cell, z);
        //return Xt;
    }

    function move(p, move) {
        return p;
        var moved = robot.p_cache * 1;
        var nomoved = p * (1 - 1);
        return robot.p_cache = (moved + nomoved);
    }

    function sense(cell, distance) {
        var marker = new Point(
            (cell.point.x + distance * Math.sin(robot.angle * Math.PI / 180)),
            (cell.point.y - distance * Math.cos(robot.angle * Math.PI / 180))
        );
        for (var i in map.coordinates) {
            var prev = map.coordinates[i - 1];
            var point = map.coordinates[i];
            if (!prev || !point)
                continue;
            
            var int = lineIntersect(cell.point, marker, prev, point);
            if (int) {
                //drawCircle(cell.point, 'rgb(200,0,200)', 5);
                var d = Math.floor(Math.abs(Math.sqrt(Math.pow(cell.point.x - int.x, 2)
                                                      + Math.pow(cell.point.y - int.y, 2))));
                //console.log(cell.point.x, cell.point.y, d, distance);
                console.log(cell.size);
                if (d >= (distance - cell.size * .5) && d <= (distance + cell.size * .5)) {
                    drawCircle(cell.point, 'rgb(0,0,200)', 10);
                    cell.p += cell.p * .9;
                    console.log(cell.point.x + 'x' + cell.point.y + ' : ' + cell.p);
                    return;
                }
            }
            cell.p -= cell.p * .1;
        }
    }

    */

    var robot, map, particles, iteration, data1, data2;

    function generate() {
        console.log('GENERATE');
        
        iteration = 0;
        data1 = [['Iteration','Distance']];
        data2 = [['Iteration','Weight']];
        document.removeEventListener('update');
        document.removeEventListener('draw');
        //map = new Map();
        robot = new Robot(
            20,    // ?
            100,   // x
            450,   // y
            0,     // angle
            5,     // speed
            0.5    // noise
        );
        robot.removeAllSensors();
        robot.addSensor(
            new Sensor(robot.sensors.length, 5,
               0,    //angle
               200,  // range
               0.5   // noise
        ));

        robot.addSensor(
            new Sensor(robot.sensors.length, 5,
               90,   //angle
               200,  // range
               0.5   // noise
        ));

        robot.addSensor(
            new Sensor(robot.sensors.length, 5,
               -90,  //angle
               200,  // range
               0.5   // noise
        ));
        
        //Particle =  clone(robot);
        //console.log(Particle);
        
        particles = new Particles(canvasWidth, canvasHeight, 
                                  200, // count
                                  10   // resample percent
                                 );
        
    }

    global.generate = generate;
})(this);
