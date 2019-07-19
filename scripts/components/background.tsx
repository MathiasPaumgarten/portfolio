import * as React from "react";
import s from "./background.scss";
import { times, random, NumericDictionary } from "lodash";
import { onRoute, observeRoute } from "../services/router";
import { DETAIL_ROUTE } from "./detail";
import { TweenLite, Power2 } from "gsap";

const TAU = Math.PI * 2;

interface Block {
    offset: number;
    size: number;
    pulses: number;
    startRepetition: number;
    startOffset: number;
    endRepetition: number;
    endOffset: number;
 }

class Line {
    public timeScale = 1;

    private blocks: Block[];
    private t = 0;
    private speed = random( 0.001, 0.006, true );

    private readonly BLOCK_AMOUNT = random( 3, 8, false );
    private readonly MAX_BLOCK_SIZE = window.innerWidth / this.BLOCK_AMOUNT;

    constructor( public y: number, public height: number ) {
        this.blocks = times( this.BLOCK_AMOUNT, i => ( {
            offset: ( i / this.BLOCK_AMOUNT ) * window.innerWidth,
            size: random( 0.8, true ),
            pulses: random( 1, 10, false ),
            startRepetition: random( 1, 3 ),
            startOffset: Math.random(),
            endRepetition: random( 1, 3 ),
            endOffset: Math.random(),
         } ) );
    }

    render( context: CanvasRenderingContext2D ) {
        const t = this.t = ( this.t + this.speed * this.timeScale ) % 1;

        for ( let i = 0; i < this.BLOCK_AMOUNT; i++ ) {
            const block = this.blocks[ i ];
            const x = ( block.offset + t * window.innerWidth ) % window.innerWidth;

            const start = this.sineLoop( ( block.startRepetition * t + block.startOffset ) % 1 ) *
                this.MAX_BLOCK_SIZE / 2 * block.size;
            const end = this.MAX_BLOCK_SIZE - this.sineLoop( ( block.endRepetition * t + block.endOffset ) % 1 ) *
                ( this.MAX_BLOCK_SIZE / 2 ) * block.size;

            const size = Math.abs( end - start );

            context.fillRect( x + Math.min( start, end ), this.y, size, this.height * this.timeScale );
        }
    }

    private sineLoop( t: number ): number {
        return Math.sin( TAU * t );
    }
}

class Animation {
    private context: CanvasRenderingContext2D;
    private lines: Line[] = [];
    private raf = -1;
    private timeScale = 1;

    set slowMo( value: boolean ) {
        TweenLite.to( this, 0.8, { timeScale: value ? 0.15 : 1, ease: Power2.easeInOut, onUpdate: () => {
            this.lines.forEach( line => line.timeScale = this.timeScale );
        } } );
    }

    constructor( private canvas: HTMLCanvasElement ) {
        this.context = canvas.getContext( "2d" )!;
        this.context.fillStyle = "rgb( 30, 30, 30 )";
        this.render = this.render.bind( this );

        const makeSize = this.sizeGenerator( 5, 50, false );

        let y = 0;
        let size = makeSize();

        while ( y < window.innerHeight ) {
            const line = new Line( y, size - 2 );

            y += size;
            size = makeSize();

            this.lines.push( line );
        }
    }

    render() {
        this.context.clearRect( 0, 0, this.canvas.width, this.canvas.height );
        this.lines.forEach( line => line.render( this.context ) );

        requestAnimationFrame( this.render );
    }

    start() {
        requestAnimationFrame( this.render );
    }

    stop() {
        cancelAnimationFrame( this.raf );
    }

    private sizeGenerator( min: number, max: number, float: Boolean ): () => number  {
        return () => random( min, max, float );
    }
}

export class Background extends React.Component {

    private canvasRef = React.createRef<HTMLCanvasElement>();
    private animation?: Animation;

    componentDidMount() {
        if ( this.canvasRef.current ) {
            const canvas = this.canvasRef.current;

            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            this.animation = new Animation( canvas );
            this.animation.start();

            observeRoute( DETAIL_ROUTE ).subscribe( ( on: boolean ) => {
                this.animation!.slowMo = on;
            } );
        }
    }

    componentWillUnmount() {
        if ( this.animation ) {
            this.animation.stop();
        }
    }

    render() {
        return <canvas className={ s.canvas } ref={ this.canvasRef }></canvas>;
    }
}




