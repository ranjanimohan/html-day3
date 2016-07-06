/*global  window, jQuery, $, MyApp */

var w;
var w_height;
var event_visible = false;

$(function () {
    "use strict";
    // Function to get the sum of all values in Array
    Array.sum = function (array) {
        // "use strict";
        for (var i=0,sum=0;i<array.length;sum+=(parseFloat(array[i++])));
        return sum;
    }

    // Function to get the Max value in Array
    Array.max = function (array) {
        return Math.max.apply( Math, array );
    };

    // Function to get the Min value in Array
    Array.min = function (array) {
       return Math.min.apply( Math, array );
    };

    function toTitleCase(str) {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }

    // Extended raphael js easing method with custom easing
    Raphael.easing_formulas.super_elastic = function(n) {
      if (n == !!n) {
        return n;
      }
      return Math.pow(2, -10 * n) * Math.sin((n - .075) * (2 * Math.PI) / .3) + 1;
    };
    
    jQuery.fn.exists = function(){return this.length>0;}
    
    var $eventBox;

    var txt  = [
        {'font': '12px myriad-pro-condensed, "Myriad Pro Condensed", "Myriad Pro", Myriad, "DejaVu Sans Condensed", "Liberation Sans", "Nimbus Sans L", Tahoma, Geneva, "Helvetica Neue", Helvetica, Arial, sans-serif', stroke: 'none', fill: '#666'},
        {'font': '12px minion-pro, Times, "Times New Roman", serif', 'font-style': 'italic', stroke: 'none', fill: '#666', 'text-anchor': 'start'}
    ];
    
    var cufon = [{font:"myriad-pro-condensed"},{attr:  "stroke: 'none', fill: '#666666'"}];
    
    /**
    * Initialise variables
    * Generates heat maps for all elements with the .graph.heat classes attached.
    */
    
    var init = function() {
        
        var wHeight = $(window).height(),
            wWidth  = $(window).width(),
            hHeight = $('body > header').height(),
            fHeight = $('body > footer').height(),
            slideHeight = wHeight - (hHeight + fHeight);
            
        //initialise scrolling functions for focus launching of animations
        //set_section_scrolls();
        //$(window).resize(set_section_scrolls);
/*
        $("figure table, figure dl").each(function(){
            $(this).hide();
            $(this).data("visible","false");
        });
*/      
        
        /*
         * Attempted Firefox fix for scorecards
         */
        
        $('#identity .scorecard .sign').css({backgroundPosition: '0px 43px'});
        $('#feed .scorecard .sign').css({backgroundPosition: '0px 34px'});
        
        $eventBox = $('.event_box');

        // if (wHeight > 900) {
        //     $('#home').css({ height: slideHeight });
        // }
        
        $eventBox.css({ /*top:*/ /*(((slideHeight / 2) - ($eventBox.outerHeight() / 2))+50)*/ /* 286 ,*/ left:  ((960 /2) - ($eventBox.outerWidth() /2))  });

        $('#viewport').carousel('#simplePrevious', '#simpleNext');

    }
    
    //scroll point function
    function set_section_scrolls() {
        w_height = $(window).height();
        $(".slide").each(function(){
            var scrolls = new Array()
            scrolls[0] = $(this).offset().top - w_height;
            scrolls[1] = $(this).offset().top + $(this).height();
            scrolls[2] = scrolls[1] - scrolls[0];
            $(this).data("scrolls",scrolls);
        });
    }

    var eventBox = function() {
        if (event_visible == false) {
            //$book = $('.event_box #book_now');

            $eventBox.animate({ opacity : 1 }, 500);
            
            event_visible = true;
        }        
    }


    /**
    * Heat map generation
    * Generates heat maps for all elements with the .graph.heat classes attached.
    */
    
    var generateHeat = function() {
        
        $('.graph.heat').each(function(id, el) {
            
                var data    = [],
                    axisx   = [],
                    axisy   = [],
                    axisz   = [],
                    $table   = $('#data-heat'+(id+1)+' table');

                $('tbody td', $table).each(function() {
                    data.push(parseFloat($(this).text(), 10));
                });
                $table.hide();
                $('thead th', $table).each(function() {
                   axisz.push($(this).text()); 
                });
                $('tbody th', $table).each(function() {
                   axisy.push($(this).text()); 
                });
                $('tfoot th', $table).each(function() {
                   axisx.push($(this).text()); 
                });


                //draw
                var width   = $(this).parent().width(), //320, //UPDATE TO BE DYNAMIC
                    height  = 420,
                    leftgutter = 30,
                    rightgutter = 60,
                    topgutter = 30,
                    bottomgutter = 90,
                    spacing = 0.5,
                    r = Raphael('heat'+(id+1), width, height),
                    //X = (width - leftgutter) / axisx.length,
                    Z = (width - topgutter) / axisz.length,
                    X = (width - rightgutter) / axisx.length,
                    Y = (height - bottomgutter) / axisy.length,
                    color = $('#heat'+(id+1)).css('color'),
                    //max = Math.round(X / 2) - 1; o % 2
                    max = 55,
                    shade1 = ['rgb(215,10,45)', 'rgb(102,102,102)'],
                    fade = [ 0.4, 0.6, 0.8, 1, 0.8, 0.6 ],
                    fade1 = [ 0.1, 0.3, 0.45, 0.85, 0.45, 0.3 ]; 
                
                var fadeIn = Raphael.animation({ 
                    'fill-opacity' : 1
                }, 1100, "<>");
                
                var fadeIn = function(level) {
                    var anim = Raphael.animation({ 
                        'fill-opacity' : level
                    }, 1800, "<>");
                    
                    return anim;
                } 
                
                for (var i = 0, ii = axisz.length; i < ii; i++) {
                    if (!$('html.lt-ie9').exists()) {
                        r.text((Z * (i + 0.4)), 10, axisz[i]).attr(txt[0])
                        .attr({ 'fill-opacity' : 0 })
                        .animate(fadeIn(0.7).delay((i+1)*50));
                    } else {
                        r.print((Z * (i + 0.4)), 10, axisz[i], r.getFont(cufon[0].font, 700), 12)
                        .attr({ 'fill-opacity': 0 }).attr({fill: '#666666'})
                        .animate(fadeIn(0.7).delay((i+1)*50));
                    }
                }

                for (var i = 0, ii = axisx.length; i < ii; i++) {
                        var textx = r.text((X * (i + spacing)), height - (bottomgutter) + 20, axisx[i])
                        .attr(txt[0]).attr({ transform: "r" + (-90), fill : shade1[i % 2] })
                        .attr({'text-anchor': 'end', 'fill-opacity' : 0})
                        .animate(fadeIn(1).delay((i+1)*50));

                }


                for (var i = 0, ii = axisy.length; i < ii; i++) {
                    r.text(width - (rightgutter ), Y * (i + spacing) + 20, axisy[i])
                    .attr(txt[1]).attr({'text-anchor': 'start', 'fill-opacity' : 0})
                    .animate(fadeIn(fade[i]).delay((i+1)*50));
                }

                var o = 0;
                for (var i = 0, ii = axisy.length; i < ii; i++) {
                    for (var j = 0, jj = axisx.length; j < jj; j++) {

                        if (id === 2) {
                            if (data[o] != 0) {
                                var R = 10;
                            } else {
                                var R = 0;
                            }
                        } else {
                            var R = data[o] && Math.min(Math.round(Math.sqrt(data[o] / Math.PI) * 12), max);
                        }
                        ////console.log(R);
                        if (R) {
                            (function (dx, dy, R, value) {
                                //var color = "hsb(" + [(1 - R / max) * .5, 1, .75] + ")";

                                //console.log("RADIUS: " + R + ' DATA: ' + data[o]);
                                
                                var max = Array.max(data);
                                var value = (data[o] / max);
                                
                                var a = value; //(R*2)/100; //0.2
                                var b = 0.9;
                                var opacity = (a + Math.random() * (b-a));
                                ////console.log(value);
                                
                                var shade = ['102,102,102', '215,10,45'];

                                ////console.log(Math.round(a + Math.random() * (b-a)));

                                ////console.log(0.2 + Math.random() * (0.9-0.2));
                                ////console.log( a + (b - a) * Math.random());
                                //var color = "rgba(215,10,45,"+ (0.2 + (0.9 - 0.2) * Math.random()) +")";
                                
                                var anim = Raphael.animation({ 
                                    r : R
                                }, (200 * (i+1)) + (200 * (j+1)), "bounce");
                                
                                var color = "rgba(" + shade[Math.round(a + Math.random() * (b-a))] + ","+ /*opacity*/ fade1[i] +")";
                                var dt = r.circle(dx + 60 + R, dy + 10, 0).attr({stroke: "none", fill: color})
                                .animate(anim.delay(1000));
/*
                                if (R < 8) {
                                    var bg = r.circle(dx + 60 + R, dy + 10, 10).attr({stroke: "none", fill: color }).hide();
                                }
*/
                                var lbl = r.text(dx + 60 + R, dy + 10, data[o])
                                        .attr(txt[0]).attr({fill: "#fff"}).hide();
                                
                                if (id === 2) {
                                    var dot = r.circle(dx + 60 + R, dy + 10, R+10).attr({stroke: "none", fill: "#000", opacity: 0});
                                } else {
                                    var dot = r.circle(dx + 60 + R, dy + 10, data[o]+10).attr({stroke: "none", fill: "#000", opacity: 0});
                                }
                                
                                dot[0].onmouseover = function () {
                                    var clr = Raphael.rgb2hsb(color);
                                    clr.b = .5;
                                    if (R < 8 /*bg*/) {
                                        //dt.hide();
                                        //bg.show();
                                        dt.animate({ r: 10, /*"fill" : Raphael.hsb2rgb(clr).hex,*/ "fill-opacity": 1}, 300, "bounce");
                                    } else {
                                        //dt.attr("fill", Raphael.hsb2rgb(clr).hex);
                                        dt.animate({"fill" : Raphael.hsb2rgb(clr).hex, r: (R+2)/*, "fill-opacity" : 1*/}, 300, "bounce");
                                    }
                                    lbl.show();
                                    if (R > 50) {
                                        lbl.toFront(); // can be removed to fix hovers
                                        //dot.toFront(); // can be removed to fix hovers
                                    }
                                };
                                dot[0].onmouseout = function () {
                                    if (R < 8 /*bg*/) {
                                        //dt.show();
                                        //bg.hide();
                                        dt.animate({ r: R, "fill" : color, "fill-opacity" : opacity }, 300, "bounce");
                                    } else {
                                        //dt.attr("fill", color);
                                        dt.animate({"fill" : color, r: R/*, "fill-opacity" : opacity*/ }, 300, "bounce");
                                    }
                                    lbl.hide();
                                };

                            //})(leftgutter + X * (j + .5) - 60 - R, Y * (i + .5) - 10, R, data[o]);
                            })((X * (j + spacing) - 60 - R), Y * (i + spacing) + 10, R, data[o]);
                        }
                        o++;
                    }
                }
            
        });

    } // end generate heat function



    /**
     * Intro
     * Produces an animation of a fixed line with 5 balls then 10 random flighted ones
     */
    
    var intro = {

        $intro  : null,
        queue   : null,

        width   : null,
        height  : null,
        r       : null,

        colours : null, //colour array
        colour  : null,
        opacity : null,

        stroke  : null, //stroke array
        strokeW : null, //stroke width

        pointx  : null,
        pointy  : null,
        
        count   : null,

        init: function() {

            var $this   = this;

            this.$intro = $('#intro');
            this.queue  = this.$intro.queue('chain');

            this.width  = 960;
            this.height = 400;
            this.r      = Raphael('intro', this.width, this.height);

            this.colours = ["215,10,45", "115,115,115"];
            this.stroke  = ["", "- "];

            this.count  = 0;
            
            this.play();
            //this.r.print(100, 100, "2.90 ECONOMY RATE", this.r.getFont("myriad-pro-condensed", 700), 16);
            //var text = this.r.print(100,100,"TEXT AREA", this.r.getFont("myriad-pro-condensed",700), 16);
            //var text = this.r.print(100,100,"RAWR RAWR", this.r.getFont(cufon[0].font, 700), 16);
            // text.attr(cufon[0].attr);
            //text.attr({ opacity: 0 });
            //text.animate({ opacity: 1 },2500);
        },

        generatePath : function() {

            var a = 0.1, //0.2
                b = 0.4,
                px = [0, 2],

                yy = [50,300],
                xx = [150,800],
                zz = [150,350],

                y = (yy[0] + Math.random() * (yy[1]-yy[0])),
                x = (xx[0] + Math.random() * (xx[1]-xx[0])),
                z = (zz[0] + Math.random() * (zz[1]-zz[0]));


                this.opacity = (a + Math.random() * (b-a));
                this.colour = 'rgb(' + this.colours[Math.round(Math.random())] +')';
                this.strokeW = px[Math.round(Math.random())];

            //var flightPath = this.r.path('M 0 ' + y +' C 0 ' + y +' 350 225 ' + x + ' 390 M ' + x + ' 390 C ' + x + ' 390 500 300 960 ' + z)
            var flightPath = this.r.path('M 0 ' + y +' C 0 ' + y + ' ' + (x-100) + ' ' + (y) + ' ' + x + ' 400 M ' + x + ' 400 C ' + x + ' 400 ' + (x+100) + ' ' + (y) + ' 960 ' + z)
                        .attr({
                            stroke: this.colour, 
                            "stroke-dasharray": this.stroke[Math.round(Math.random())], 
                            'stroke-opacity': 0
                        });

            flightPath.animate({'stroke-opacity': this.opacity}, 1000, '>');

            return flightPath;
        },

        bowlBall: function(path, endPoint, next, main) {

            if (main) {
                this.colour = 'rgb(215,10,45)';
                this.opacity = 1;
                this.strokeW = "0"
            }

            var $this = this,
                fill = this.colour;

            if (this.strokeW != 0) {
                fill = "none";
            }

            var len = path.getTotalLength(),
                e = this.r.circle(0, 0, 7, 7).attr(
                        { 
                            'stroke-width': this.strokeW,
                            'stroke': this.colour,
                            'stroke-opacity' : this.opacity,
                            fill: fill,
                            'fill-opacity': 0
                        }
                ).onAnimation(function() {
                    var t = this.attr('transform');
                });

            this.r.customAttributes.along = function (v, j) {
                var point = path.getPointAtLength(v * len-endPoint);

                $this.pointx = point.x;
                $this.pointy = point.y;

                return {
                    transform: "t" + [point.x, point.y] + "r" + point.alpha
                };
            }
            e.attr({along: 0});

            var rotatealongThePath = false;
            function run() {
                e.animate({ 'fill-opacity': $this.opacity }, 250, '<', function() {
                    e.animate({along: 1}, 750, "<>", function() {
                       next();
                    });
                });
            }
            run();

        },

        play: function() {

            var $this = this;
            
            var attr = {'font-size' : '16px', fill: "#000000", 'text-anchor': 'start', opacity: 0};
            var attr1 = {'font-size' : '16px', opacity: 0 }
            
            var mainPath = this.r.path('M 0 0 C 0 0 450 125 550 400 M 550 400 C 550 400 560 320 960 100')
                        .attr({
                            stroke: 'rgb(215,10,45)', 
                            //"stroke-dasharray": "- ",
                            'stroke-opacity': 0
                        });
               
            var count = 1;
            var disclaimer;
            
            var animChain = function (next){
                
                var animIn =  Raphael.animation({ 
                    opacity: 1
                }, 750, ">", function() {
                    this.animate(animOut.delay(5200 / count));
                });
            
                var animOut = Raphael.animation({ 
                    opacity: 0
                }, 350, "<>", function() {
                    next();
                });
                
                count++;
                return (animIn.delay(2200 / count));
            }
            
            this.$intro.queue('chain', function(next) {
                if (!$('html.lt-ie9').exists()) {

                    disclaimer = $this.r.text( ($this.width - 185) , ($this.height - 20), ' ')
                    .attr(txt[1]).attr({ 'text-anchor': 'start', opacity: 0})
                    .animate({opacity : 1}, 400, ">");
                    
                    var introTxt1 = $this.r.text( ($this.width / 2) , ($this.height / 2), "JAMES ANDERSON IS ENGLAND'S MOST SUCCESSFUL BOWLER OF ALL TIME...")
                    .attr(txt[0]).attr({ 'font-size' : 26, fill : '#000000', opacity: 0})
                    .animate(animChain(next));
                } else {
                    next();
                }
            });

            this.$intro.queue('chain', function(next) {
                if (!$('html.lt-ie9').exists()) {
                    var introTxt1 = $this.r.text( ($this.width / 2) , ($this.height / 2), "FOLLOW HIS PROGRESS HERE...")
                    .attr(txt[0]).attr({ 'font-size' : 24, fill : '#000000', opacity: 0})
                    .animate(animChain(next));
                } else {
                    next();
                }
            });
            
            this.$intro.queue('chain', function(next) {
                if (!$('html.lt-ie9').exists()) {
                    disclaimer.animate({opacity:0}, 400, ">");
                    $('#intro').prepend('<div id="downArrow"><a href="#" id="downArrow">Start the journey of numbers...</a></div>');
                        $('#downArrow').animate({ opacity: 0.6 }, 1000, function() {
                            $('#downArrow a').click(function() {
                                $.scrollTo(620, 850, {
                                    'axis' : 'y', 
                                    easing : 'easeInOutCubic'
                                });
                               return false; 
                            });
                        });
                    next();
                } else {
                    next();
                }
            });
            
            this.$intro.queue('chain', function(next) {
                mainPath.animate({'stroke-opacity': 0.8}, 1000, '>', function() {
                    $this.bowlBall(mainPath, 75, next, true);
                });
            });

            this.$intro.queue('chain', function(next) {
                if (!$('html.lt-ie9').exists()) {
                    $this.r.text($this.pointx - 100, $this.pointy - 10, '3.78 ECONOMY\nRATE')
                    .attr(txt[0]).attr(attr).animate({opacity: 1}, 450, ">");
                } else {
                    $this.r.print($this.pointx - 100, $this.pointy - 10, "3.78 ECONOMY", $this.r.getFont(cufon[0].font, 700), 16).attr({ opacity: 0 }).animate({opacity: 1}, 450, ">");
                    $this.r.print($this.pointx - 100, $this.pointy + 10, "RATE", $this.r.getFont(cufon[0].font, 700), 16).attr({ opacity: 0 }).animate({opacity: 1}, 450, ">");
                }
                next();
            });

            this.$intro.queue('chain', function(next) {
                $this.bowlBall(mainPath, 220, next, true);
            });

            this.$intro.queue('chain', function(next) {
                $this.r.text($this.pointx + 20, $this.pointy + 10, '48.2 strike\nrate').attr(txt[1]).attr(attr1).animate({opacity: 1}, 450, ">", function(){
                    //next();
                     eventBox();
                });
                next();
            });

            this.$intro.queue('chain', function(next) {
                $this.bowlBall(mainPath, 400, next, true);
            });

            this.$intro.queue('chain', function(next) {
                $this.bowlBall(mainPath, 650, next, true);
            });

            this.$intro.queue('chain', function(next) {
                if (!$('html.lt-ie9').exists()) {
                    $this.r.text($this.pointx + 20, $this.pointy - 10, '16087 RUNS\nCONCEDED')
                    .attr(txt[0]).attr(attr).animate({opacity: 1}, 450, ">");
                } else {
                    $this.r.print($this.pointx + 20, $this.pointy - 10, "16087 RUNS", $this.r.getFont(cufon[0].font, 700), 16).attr({ opacity: 0 }).animate({opacity: 1}, 450, ">");
                    $this.r.print($this.pointx + 20, $this.pointy + 10, "CONCEDED", $this.r.getFont(cufon[0].font, 700), 16).attr({ opacity: 0 }).animate({opacity: 1}, 450, ">");
                }
                next();
            });

            this.$intro.queue('chain', function(next) {
                $this.bowlBall(mainPath, 820, next, true);
            });

            this.$intro.queue('chain', function(next) {
                $this.r.text($this.pointx + 25, $this.pointy, '528 wickets').attr(txt[1]).attr(attr1).animate({opacity: 1}, 450, ">", function(){
                    //next();
                });
                next();
            });

            this.$intro.queue('chain', function(next) {
                $this.bowlBall(mainPath, 1050, next, true);
            });

            this.$intro.queue('chain', function(next) {
                if (!$('html.lt-ie9').exists()) {
                    $this.r.text($this.pointx + 25, $this.pointy - 10, '4246.1 OVERS\nBOWLED')
                    .attr(txt[0]).attr(attr).animate({opacity: 1}, 450, ">", function(){
                        next();
                    });
                } else {
                    $this.r.print($this.pointx + 25, $this.pointy - 20, "4246.1 OVERS", $this.r.getFont(cufon[0].font, 700), 16).attr({ opacity: 0 }).animate({opacity: 1}, 450, ">");
                    $this.r.print($this.pointx + 25, $this.pointy, "BOWLED", $this.r.getFont(cufon[0].font, 700), 16).attr({ opacity: 0 }).animate({opacity: 1}, 450, ">");
                }
            });

            /* End main path animation, begin background paths */

            for (var i = 0; i < 10; i++) {
                this.$intro.queue('chain', function(next) {
                    $this.count++;
                    $this.bowlBall($this.generatePath(), (20 + Math.random() * (500-20)), next);
                    
                    if ($this.count == 2) {
                        // see more arrow used to be here!
                    }
                   
                });
            }

            this.$intro.dequeue('chain');
        }

    }



    /**
     * Scrollcard plugin
     * Animates numbers to represent a live scorecard
     */

    var scorecard = {
        
        largeSign: function(count) {
            
            var sign = $('#identity .scorecard');
            
            //var positiony = parseInt($('.sign', sign).css('background-position-y').replace('px', ''));
            var positiony = 43;
            var height = 105 - positiony;
            var baseSpeed = 800;
            
            ////console.log(height + ' ' + this.positiony);
            this.animation(sign, height, positiony, baseSpeed, count);
        },

        smallSign: function(count) {

            var sign = $('#feed .scorecard');

            //var positiony = parseInt($('.sign', sign).css('background-position-y').replace('px', ''));
            var positiony = 34;
            var height = 82.9 - positiony;
            var baseSpeed = 1500;
            
            ////console.log(height + ' ' + this.positiony);
            this.animation(sign, height, positiony, baseSpeed, count);
        },

        animation: function(size, height, positiony, baseSpeed, count) {

            var $this = this,
                delay = 1000, //ms
                value;

            var scrollSign = function() {

                $('.sign', size).each(function(index, sign) {

                    value = parseInt(count+$(this).text());
                    // alert(value+' '+$(this).text());
                    // alert(index);

                    if (index > 2) {
                        baseSpeed = baseSpeed + 30;
                    }
                    
                    // console.log('height * value + positiony: ' + height + ' * ' + value + ' + ' + positiony + ' = ' + ((height * value)+(positiony)));
                    // console.log($this.positiony);

                    if ((index === 0) || (index === 3) || (index === 6) || (index === 9)) {
                        $(this).animate({backgroundPosition: '0px ' + ((height * value)+(positiony)) + 'px'}, baseSpeed*1.6);
                    } else if ((index === 1) || (index === 4) || (index === 7) || (index === 10)) {
                        $(this).animate({backgroundPosition: '0px ' + ((height * value)+(positiony)) + 'px'}, baseSpeed*1.8);
                    } else if ((index === 2) || (index === 5) || (index === 8) || (index === 11)) { 
                        $(this).animate({backgroundPosition: '0px ' + (((height * value)-height)+positiony) + 'px'}, baseSpeed*2, function() {
                                $(this).delay(200).animate({backgroundPosition: '0px ' + ((height * parseInt(count+$(this).text()))+positiony) + 'px'}, 1000);
                            });
                    }

                });
            }
            
            setTimeout(scrollSign, delay);

        }

    }
    

    
    /**
     * Line graph generation
     * Generates line graphs for all elements with the .graph.line classes attached.
     */

    var generateLine = function() {

        $('.graph.line').each(function(i) {
             
            var data    = [],
                coords  = [],
                axisx   = [],
                axisy   = [],
                $table  = $('#data-line'+(i+1)+' table');

/*             
             $('tbody td', $table).each(function(i) {
                 data.push(parseFloat($(this).text(), 10));
             });
*/

            $('tbody tr', $table).each(function(y) {
                data[y] = [];
                $('td', $(this)).each(function(x) {
                    data[y][x] = parseFloat($(this).text(), 10);
                })
            });

            $table.hide();

            $('tbody th', $table).each(function() {
                axisy.push($(this).text()); 
            });

            $('tfoot th', $table).each(function() {
                axisx.push($(this).text()); 
            });
             
             //draw
             var width   = $(this).parent().width(), //320, //UPDATE TO BE DYNAMIC
                 height  = 200,
                 bottomgutter = 30,
                 spacing = 0.5,
                 graphHeight = 65,
                 r = Raphael('line'+(i+1), width, height),
                 //txt = {'font': '12px minion-pro, Times, "Times New Roman", serif', 'font-style': 'italic', stroke: 'none', fill: '#666'},
                 //txt1 = {'font': '12px myriad-pro-condensed, "Myriad Pro Condensed", "Myriad Pro", Myriad, "DejaVu Sans Condensed", "Liberation Sans", "Nimbus Sans L", Tahoma, Geneva, "Helvetica Neue", Helvetica, Arial, sans-serif', stroke: 'none', fill: '#666'},
                 X = width / axisx.length,
                 Y = (height - bottomgutter) / axisy.length,
                 color = $('#line'+(i+1)).css('color'),
                 shade = ['rgba(215,10,45,0.8)', 'rgba(102,102,102,0.8)'];


             for (var i = 0, ii = axisx.length; i < ii; i++) {
                 r.text((X * (i + spacing)), height - (bottomgutter) + 20, axisx[i]).attr(txt[1]).attr({'text-anchor': 'middle'});
             }


             var o = 0;
             for (var i = 0, ii = axisy.length; i < ii; i++) {
                 
                 //console.log('New row...');

                 coords[i] = [];
                 var path = "";
                 var max = Array.max(data[i]);
                 
                 for (var j = 0, jj = axisx.length; j < jj; j++) {

                     var R = 0;
                     var range = (data[i][j] / max)*100;
                     var yPos = (graphHeight - (graphHeight * (range/100)));
                     var shift = [-20, 20];

                     coords[i][j] = [{ x: Math.round((X * (j + spacing))), y: Math.round((Y * (i + 0.2) + (yPos+10)) - (i*20)) }];
                     
                     if (j == 0) {
                         path = "M " + coords[i][j][0].x + ' ' + coords[i][j][0].y;
                     }
                     
                     path = path + ' L ' + coords[i][j][0].x + ' ' + coords[i][j][0].y + ' ';
                     
                     r.text(coords[i][j][0].x, (coords[i][j][0].y + shift[i]), data[i][j]).attr(txt[0]).attr({fill: shade[i], opacity: 0}).animate({
                         opacity: 1
                     }, 800, "<>");
                     
/*
                     var shade = ['rgba(215,10,45,0.8)', 'rgba(102,102,102,0.8)'];
                     var dt = r.circle((X * (j + spacing)), 300, R).attr({stroke: "none", fill: shade[i] });
                     dt.animate({
                         cy: (Y * (i + 0.2) + yPos) - (i*20), easing: "elastic", r: 4 
                     }, (300*(j+1)) +((i+1)*300) ); */
                     
                     (function (dx, dy, data) {
                         var dt = r.circle(dx, 160, R).attr({stroke: "none", fill: shade[i] });
                         dt.animate({ 
                             cy: dy, r: 4,  
                         }, (500*(j+1)) +((i+1)*200), "elastic");
                         
                         var dot = r.circle(dx, dy, 18).attr({stroke: "none", fill: "#000", opacity: 0});
                         dot[0].onmouseover = function () {
                             dt.animate({
                                 r: 9
                             }, 300, "bounce");
                         };
                         dot[0].onmouseout = function () {
                             dt.animate({
                                 r: 4
                             }, 300, "bounce");
                         };
                         
                     })( coords[i][j][0].x, coords[i][j][0].y, R );
                     
/*
                     (function (dx, dy, data, value) {
                         var shade = ['rgba(215,10,45,0.8)', 'rgba(102,102,102,0.8)'];
                         ////console.log(dx + ' ' + dy + ' ' + data + ' ' + value);
                         var dt = r.circle(dx, dy, R).attr({stroke: "none", fill: shade[i] });
                         dt.animate({ r: 4 }, 1000, "bounce");
                     })((X * (j + spacing)), (Y * (i + 0.2) + yPos) - (i*20), R, data[o]); */
                     
                     o++;
                 }
                 var lines = r.path(path).attr({ "stroke-dasharray": "- ", stroke: shade[i], 'stroke-width': 1, opacity: 0 });
                 lines.animate({
                     opacity: 1
                 }, 2000);
                 //console.log(path);
                 
                 r.text(width, 10 + (15*i), axisy[i]).attr(txt[0]).attr({fill: shade[i], opacity: 0, 'text-anchor': 'end' }).animate({
                     opacity: 1
                 }, 800, "<>");
             }

         });

     };




    var barGraph = function() {

        $('.graph.bar').each(function(i) {

            var data    = [],
                axisy   = [],
                $table  = $('#data-bar'+(i+1)+' table');

            $('tbody tr', $table).each(function(y) {
                data[y] = [];
                $('td', $(this)).each(function(x) {
                    data[y][x] = parseFloat($(this).text(), 10);
                })
            });

            $table.hide();

            $('tbody th', $table).each(function() {
                axisy.push($(this).text()); 
            });

             //draw
            var width   = $(this).parent().width(), //320, //UPDATE TO BE DYNAMIC
                height  = 300,
                leftgutter = 80,
                spacing = 0.1,
                r = Raphael('bar'+(i+1), width, height),
                //txt = {'font': '12px minion-pro, Times, "Times New Roman", serif', 'font-style': 'italic', stroke: 'none', fill: '#666', 'text-anchor': 'start'},
                //txt1 = {'font': '12px myriad-pro-condensed, "Myriad Pro Condensed", "Myriad Pro", Myriad, "DejaVu Sans Condensed", "Liberation Sans", "Nimbus Sans L", Tahoma, Geneva, "Helvetica Neue", Helvetica, Arial, sans-serif', stroke: 'none', fill: '#666', 'text-anchor': 'start'},
                X = (width - leftgutter),
                Y = height / axisy.length,
                color = $('#bar'+(i+1)).css('color'),
                shade = ['url(../wordpress/wp-content/themes/jamesanderson613/static/img/3x3-red.png)', 'url(../wordpress/wp-content/themes/jamesanderson613/static/img/3x3-grey.png)'],
                colour = ['rgba(102,102,102,0.8)', 'rgba(215,10,45,0.8)'];

            var max = Array.max(data);

            for (var i = 0, ii = axisy.length; i < ii; i++) {
                r.text(0, Y * (i + spacing) + 20, axisy[i]).attr(txt[1]);
            }

            var o = 0;
            for (var i = 0, ii = axisy.length; i < ii; i++) {

                var barPercentage = (data[i][0] / max) * 100;
                var barWidth = ((barPercentage / 100) * (X));

                var barX    = leftgutter;
                var barY    = (Y * (i+spacing)+10)
                var barEnd  = (barWidth + leftgutter);

                var bar = r.path("M "+barX +" "+barY+" L "+barX+" "+barY+" L "+barX+' '+(barY+20)+" L "+barX+" "+(barY+20)+" Z");
                bar.attr({ 'stroke-width': 0, fill: shade[o % 2], opacity: 0});

                bar.animate({
                    path: "M "+barX +" "+barY+" L "+barEnd+" "+barY+" L "+barEnd+' '+(barY+20)+" L "+barX+" "+(barY+20)+" Z",
                    opacity: 0.2,
                },((i+5)*250), "bounce");

                r.text((barX+47), (barY + 10), data[o] +" WICKETS").attr(txt[1])
                    .attr(txt[0]).attr({ fill: colour[o % 2]});

                o++;
            }

        });

    };

    var generateRadial = function() {

        $('.graph.radial').each(function(id, el) {

            var data    = [],
                axisx   = [],
                $table  = $('#data-radial'+(id+1)+' table');

            $('thead th', $table).each(function() {
                axisx.push($(this).text()); 
            });
            
            $('tbody td', $table).each(function() {
                data.push($(this).text()); 
            });

            $table.hide();

            //draw
            var width   = $(this).parent().width(), //320, //UPDATE TO BE DYNAMIC
                height  = 250,
                topgutter = 50,
                leftgutter = 10,
                rightgutter = 10,
                bottomgutter = 50,
                spacing = 0.6,
                r = Raphael('radial'+(id+1), width, height),
                //txt1 = {'font': '12px minion-pro, Times, "Times New Roman", serif', 'font-style': 'italic', stroke: 'none', fill: '#666', 'text-anchor': 'start'},
                //txt = {'font': '12px myriad-pro-condensed, "Myriad Pro Condensed", "Myriad Pro", Myriad, "DejaVu Sans Condensed", "Liberation Sans", "Nimbus Sans L", Tahoma, Geneva, "Helvetica Neue", Helvetica, Arial, sans-serif', stroke: 'none', fill: '#666', 'text-anchor': 'start'},

                X = ( width - (leftgutter + rightgutter) ) / axisx.length,
                Y = height - ( topgutter + bottomgutter ),

                color = $('#radial'+(id+1)).css('color'),
                shades = ['102,102,102', '215,10,45'],
                params = [
                    { "fill-opacity": 0, "stroke-width": 1 }, 
                    { "fill-opacity": 1, "stroke-width": 0 }
                ];
                
                
            var queue  = $table.queue('chain');
            var max = Array.max(data);
            var min = Array.min(data);

            var minR = 25;
            var maxR = 160;

            var sum = Array.sum(data);
            var coords = [];
            
            var generatePhase1 = function(next) {

                for (var i = 0, ii = axisx.length; i < ii; i++) {

                    (function () {
                    
                        var dx;
                        var percentage = (data[i] / sum) * 100; //(data[i] / max)*100;
                        ////console.log(percentage);
                        //var R = (((width / 100) * percentage) / 2);
                        var R = (((maxR - minR)/100) * percentage) + minR;
                    
                        var max = Array.max(data);
                        var value = (data[i] / max);
                    
                        var a = value; //(R*2)/100; //0.2
                    
                        //console.log('A: ' + a);
                    
                        var b = 0.8;
                        var opacity = (a + Math.random() * (b-a));
                        //console.log(opacity);

                        var color = "rgb(" + shades[Math.round(a + Math.random() * (b-a))] +")";

                        //console.log('X: ' + X + ', R: ' + R + ', i: ' + i + ', total: ' + (X * (i + spacing)));

                        /**
                        * Massively fudgey, but it's the only time saving way of getting the results to space correctly.
                        */

                        if (i == 1) {
                            dx = ((X) * (i + spacing+0.3));
                        } else if (i == 2) {
                            dx = ((X) * (i + spacing+0.8));
                        } else if (i == 3) {
                            dx = ((X) * (i + spacing+0.9));
                        } else if (i == 4) {
                            dx = ((X) * (i + spacing+0.7));
                        } else if (i == 4) {
                            dx = ((X) * (i + spacing+0.5));
                        } else if (i == 5) {
                            dx = ((X) * (i + spacing+0.4));
                        } else if (i == 6) {
                            dx = ((X) * (i + spacing+0.1));
                        } else {
                            dx = ((X) * (i + spacing));
                        }
                    
                        coords[i] = { x: dx, y: 120 };
                        //
                        // if statement wrapper is to ensure next only fires after last circle is drawn
                        //
                        //if (i !== (ii-1)) {
                        if (i == 3) {
                            var radial = r.circle(dx, 120, 0)
                            .attr({ fill: color, stroke: color  })
                            .attr(params[Math.round(a + Math.random() * (b-a))]).attr({ opacity: opacity })
                            .animate({
                                r: R
                            }, (200)+((i+1)*200), "bounce", function(){
                                next();
                            });
                        } else {
                            var radial = r.circle(dx, 120, 0)
                            .attr({ fill: color, stroke: color  })
                            .attr(params[Math.round(a + Math.random() * (b-a))]).attr({ opacity: opacity })
                            .animate({
                                r: R
                            }, (200)+((i+1)*200), "bounce", function(){
                            });
                        }

                        radial[0].onmouseover = function () {
                            var clr = Raphael.rgb2hsb(color);
                            clr.b = .5;
                            radial.animate({
                                r: (R+5),
                                fill: Raphael.hsb2rgb(clr).hex,
                                'stroke-opacity' : 1
                            }, 300, "bounce");
                        };
                        radial[0].onmouseout = function () {
                            radial.animate({
                                r: R,
                                fill: color,
                                'stroke-opacity': opacity
                            }, 300, "bounce");
                        };

                    })();

                }
            } //end generate

            var generatePhase2 = function(next, i) {

                for (var i =0, ii = axisx.length; i < ii; i++) {
              
                    if (i === 4) {
                        var anim = Raphael.animation({ r: 2 }, 500, "bounce", function() {
                            next();
                        });
                    } else {
                        var anim = Raphael.animation({ r: 2 }, 500, "bounce");
                    }

                    var centre = r.circle(coords[i].x, 120, 0)
                    .attr({ fill: "rgb(102,102,102)", stroke: "0" })
                    .animate(anim.delay(i*50));

                }

            }

            var generatePhase3 = function(next) {

                var yPos = [ 20, 230, 230, 20, 230, 20, 230 ];

                for (var i = 0, ii = axisx.length; i < ii; i++) {

                    if (i < (ii-1) ) {
                        var anim = Raphael.animation({ 
                            path: "M " + coords[i].x + ' 120 L ' + coords[i].x + ' ' + yPos[i] 
                        }, 550, "bounce");
                    } else {
                        var anim = Raphael.animation({ 
                                path: "M " + coords[i].x + ' 120 L ' + coords[i].x + ' ' + yPos[i] 
                            }, 550, "bounce", function() {
                            next();
                        });
                    }

                    var line = r.path("M " + coords[i].x + ' 120 L ' + coords[i].x + ' 120')
                    .attr({ stroke: "rgb(102,102,102)", "stroke-width": 1 })
                    .animate(anim.delay(i*75));

                }

            }

            var generatePhase4 = function(next) {

                var yPos = [ 20, 230, 230, 20, 230, 20, 230 ];

                var textPos = [
                    { anchor: "end", offset: -5 }, 
                    { anchor: "start", offset: 5 },
                    { anchor: "start", offset: 5 },
                    { anchor: "end", offset: -5 },
                    { anchor: "start", offset: 5 },
                    { anchor: "end", offset: -5 },
                    { anchor: "start", offset: 5 }
                ];

                var textStyle = [txt[0], txt[1]];

                var anim = Raphael.animation({ 
                    "fill-opacity" : 1
                }, 1200, "<>");

                for (var i = 0, ii = axisx.length; i < ii; i++) {

                    if (i % 2) {
                        axisx[i] = toTitleCase(axisx[i]);
                    }

                    var stats = r.text( (coords[i].x + textPos[i].offset), yPos[i], data[i] +'\n'+axisx[i]).attr(textStyle[i % 2]).attr({ 'text-anchor' : textPos[i].anchor }).attr({ "fill-opacity" : 0 }).animate(anim.delay(70*i));

                }

            }

            var play = function () {

                $table.queue('chain', function(next) {
                    generatePhase1(next);
                });
                
                $table.queue('chain', function(next) {
                    generatePhase2(next);
                });
                
                $table.queue('chain', function(next) {
                    generatePhase3(next);
                });

                $table.queue('chain', function(next) {
                    generatePhase4(next);
                });

                $table.queue('chain', function(next) {
                    //console.log('BACON!!!!');
                });

                $table.dequeue('chain');

            }(); //end play 
        });

    }
/*
    Raphael.fn.arc = function(startX, startY, endX, endY, radius1, radius2, angle) { 
        var arcSVG = [radius1, radius2, angle, 0, 1, endX, endY].join(' '); 
        return this.path('M'+startX+' '+startY + " a " + arcSVG); 
    }; 

    Raphael.fn.circularArc = function(centerX, centerY, radius, startAngle, endAngle) { 
        var startX = centerX+radius*Math.cos(startAngle*Math.PI/180); 
        var startY = centerY+radius*Math.sin(startAngle*Math.PI/180); 
        var endX = centerX+radius*Math.cos(endAngle*Math.PI/180); 
        var endY = centerY+radius*Math.sin(endAngle*Math.PI/180); 
        return this.arc(startX, startY, endX-startX, endY-startY, radius, radius, 0); 
    }; 
*/   
    var ballGraph = function() {
        
        $('.graph.ball').each(function(id, el) {

            var data    = [],
                axisx   = [],
                $table  = $('#data-ball'+(id+1)+' dl');

            $('dd', $table).each(function() {
                axisx.push($(this).text()); 
            });
            
            $('dt', $table).each(function() {
                data.push($(this).text()); 
            });

            //$table.hide();

             //draw
            var width   = $(this).parent().width(), //320, //UPDATE TO BE DYNAMIC
                height  = 80,
                spacing = 0.5,
                r = Raphael('ball'+(id+1), width, height),
                //txt = {'font-size': '12px', 'font-family': 'minion-pro, Times, "Times New Roman", serif', 'font-style': 'italic', stroke: 'none', fill: '#666', 'text-anchor': 'middle'},
                //txt1 = {'font-size': '12px', 'font-family': 'myriad-pro-condensed, "Myriad Pro Condensed", Univers, Calibri, "Gill Sans", "Gill Sans MT", "Myriad Pro", Myriad, "DejaVu Sans Condensed", "Liberation Sans", "Nimbus Sans L", Tahoma, Geneva, "Helvetica Neue", Helvetica, Arial, sans serif', stroke: 'none', fill: '#666', 'text-anchor': 'middle'},
                X = (width / axisx.length),
                Y = height,
                color = $('#ball'+(id+1)).css('color'),
                shade = ['url(/wordpress/wp-content/themes/jamesanderson613/static/img/scanlines-red.png)', 'url(/wordpress/wp-content/themes/jamesanderson613/static/img/scanlines-grey.png)'],
                colour = ['rgba(102,102,102,0.8)', 'rgba(215,10,45,0.8)'];
                
            var coords = [];
                    
            var queue  = $table.queue('chain');
            
            var generatePhase1 = function (next) {

                for (var i = 0, ii = axisx.length; i < ii; i++) {
                    
                    (function () {
                        var R = (X/3);

                        var xPos = X * (i + spacing);
                        var yPos = R+5;
                        coords[i] = {x: xPos, y: yPos};

                        //"clip-rect": (X * (i + spacing))-R + " 30 100 20"

                        var attr = { "clip-rect": (xPos)-R + " " + ((R*2)+5) + " " + (R*2) + " " + ((R*2)+5) };
               
    /*
                        var anim2 = Raphael.animation({ 
                            "clip-rect": (xPos)-R + " " + 0 + " " + ((R*2)+5) + " " + 0
                        }, 750, "bounce");

                        var anim3 = Raphael.animation({ 
                            "clip-rect": (xPos)-R + " " + yPos + " " + (R*2) + " 50"
                        }, 750, "bounce");
        */

                        var ballOutline = r.circle(xPos, yPos, R).attr({ stroke: colour[i % 2] });

                        var ballFill = r.circle(xPos, yPos, R)
                        .attr({ "stroke-width": 0, fill: colour[i % 2] }).attr(attr);
                    
                        var loop = function(count) {
                            
                            var duration = (i+5)*150;
/*                      
                            if (count > 1) {
                                var duration = (i+1)*50;
                            } else {
                                var duration = 450;
                            }
*/                      
                            
                            var anim = Raphael.animation({ 
                                "clip-rect": (xPos)-R + " " + -60 + " " + ((R*2)+5) + " " + ((R*2)+5)
                            }, duration, "<", function() {
                                
                                ballFill.attr(attr);
                                
                                if (count > 1) {
                                    count--;
                                    loop(count);
                                } else {
                                    
                                    var animEnd = Raphael.animation({ 
                                        "clip-rect": (xPos)-R + " " + yPos + " " + (R*2) + " 50"
                                    }, 750, "bounce", function() {
                                       next(); 
                                    });
                                    
                                    ballFill.animate(animEnd.delay(i*55));
                                }

                            });
                        
                            ballFill.animate(anim.delay(i*55));
                        }
                        loop(1);
                    })();

                    //var ball = r.circularArc(X * (i + spacing), R+5, R, 0, 180);
                    //var fill = r.path("M " + (X * (i + spacing)) + " " + (R+5) + " a 30 30 0 1 0 30 30").attr({stroke: "#080", opacity: 1, "stroke-width" : 1});

                    //var top = r.path("M 0 0 h 12 v 4 h -12 z");

                }
   
            }
            
            var generatePhase2 = function(next) {
/*
                var yPos = [ 20, 230, 230, 20, 230, 20, 230 ];

                var textPos = [
                    { anchor: "end", offset: -5 }, 
                    { anchor: "start", offset: 5 },
                    { anchor: "start", offset: 5 },
                    { anchor: "end", offset: -5 },
                    { anchor: "start", offset: 5 },
                    { anchor: "end", offset: -5 },
                    { anchor: "start", offset: 5 }
                ];

                var textStyle = [txt, txt1];
*/
                var anim = Raphael.animation({ 
                    "fill-opacity" : 1
                }, 800, "<>");

                for (var i = 0, ii = axisx.length; i < ii; i++) {
                    
                    axisx[i] = axisx[i].toUpperCase();
                    data[i] = data[i].toUpperCase();
                    
                    var statsTop = r.text(coords[i].x, (coords[i].y)-10, axisx[i]).attr(txt[0]).attr({ fill: "rgb(102,102,102)" }).attr({ "fill-opacity" : 0 }).animate(anim.delay(150*i));
                    
                    var statsBottom = r.text(coords[i].x, (coords[i].y)+10, data[i]).attr(txt[0]).attr({ fill: "#F1E4D3" }).attr({ "fill-opacity" : 0 }).animate(anim.delay(125*i));

                }
            }
            
            var play = function() {
                
                $table.queue('chain', function(next) {
                    generatePhase1(next);
                });
       
                $table.queue('chain', function(next) {
                    generatePhase2(next);
                });

                $table.dequeue('chain');
                
            }();
            
        });
        
    }

    /**
    * Function launch wrapper
    * Initialises animations when scroll gets in focus
    */
    
    scorecard.largeSign(3);
    scorecard.smallSign(3);
    
    if ($('body.home').exists()) {
        //console.log('wtf?');
        init();
        intro.init();
    
        $(window).scroll(function() {
            eventBox();
            if ($('#downArrow').exists()) {
                $('#downArrow').fadeOut();
            }
        });
    
        $('#bar1').appear(function() {
            generateLine();
        });
    
        $('#bar1').appear(function() {
            barGraph(); 
        });
    
        $('#slide2 .dismissal').appear(function() {
            generateHeat();  
        });

        $('#slide3 .dismissal').appear(function() {
            generateRadial();
        });
    
        $('#slide4 span.night_watchmen_1').appear(function() {
            ballGraph();
        });
        
    }

    if ($('body.page-template-template-events-php').exists()) {
        $('.event_image').each(function(id, el) { 
            
            id = id+1;
            
            $(this).data("id",id);
            
            console.log($(this).data());
            
            if (id != 4) {
                $('#event'+id).hide();
            } else {
                $('#event'+id).show();
            }
                           
        });
        
        var clicked = 4;
        
        $('.event_image').click(function() {
            $this = $(this);
            
            $('.event_image_bg').removeClass('imgHover');
            
            $('#event'+clicked).fadeOut(200, function() {
                clicked = $this.data('id');
                $('#event'+($this.data('id'))).fadeIn(200);
            });
            
            $('.event_image_bg', $(this)).addClass('imgHover');
        });

    }


    $('#identity').hover(
        function() {
            $('#whatis613').stop().animate({opacity:1});
        },
        function() {
            $('#whatis613').stop().animate({opacity:0});
        }
    );

/*
    $('#slide1').appear(function() {
        $('#slide1 .number.digit').each(function(i) {
            $(this).countTo({
                from: 0,
                to: parseFloat($(this).text()),
                speed: 10*(i+1),
                refreshInterval: 5
            });
        });
    });
*/
});
