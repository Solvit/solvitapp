//
//  ViewController.m
//  Solvit
//
//  Created by Stuart Farmer on 5/2/15.
//  Copyright (c) 2015 Solvit. All rights reserved.
//

#import "ViewController.h"
#import "SLVStroke.h"

@interface ViewController () {
    CGPoint lastPoint;
    SLVStroke *currentStroke;
    NSMutableArray *strokes;
    
    BOOL isSwiped;
}

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    // Allocate the strokes array that holds all strokes.
    strokes = [[NSMutableArray alloc] init];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

#pragma Drawing Methods
- (void)touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event {
    isSwiped = NO;
    
    UITouch *touch = [touches anyObject];
    lastPoint = [touch locationInView:self.view];
    
    // Allocate the stroke
    currentStroke = [[SLVStroke alloc] init];
    
    // Add the first x and y coordinates to the array.
    [currentStroke.x addObject:[NSNumber numberWithFloat:lastPoint.x]];
    [currentStroke.y addObject:[NSNumber numberWithFloat:lastPoint.y]];
}

- (void)touchesMoved:(NSSet *)touches withEvent:(UIEvent *)event {
    isSwiped = YES;
    
    UITouch *touch = [touches anyObject];
    CGPoint currentPoint = [touch locationInView:self.view];
    
    UIGraphicsBeginImageContext(self.drawingBoard.frame.size);
    [self.drawingBoard.image drawInRect:self.drawingBoard.frame];
    CGContextMoveToPoint(UIGraphicsGetCurrentContext(), lastPoint.x, lastPoint.y);
    CGContextAddLineToPoint(UIGraphicsGetCurrentContext(), currentPoint.x, currentPoint.y);
    CGContextSetLineCap(UIGraphicsGetCurrentContext(), kCGLineCapRound);
    CGContextSetLineWidth(UIGraphicsGetCurrentContext(), 2.0f );
    CGContextSetRGBStrokeColor(UIGraphicsGetCurrentContext(), 0.0, 0.0, 0.0, 1.0);
    CGContextSetBlendMode(UIGraphicsGetCurrentContext(),kCGBlendModeNormal);
    
    CGContextStrokePath(UIGraphicsGetCurrentContext());
    self.drawingBoard.image = UIGraphicsGetImageFromCurrentImageContext();
    [self.drawingBoard setAlpha:1.0f];
    UIGraphicsEndImageContext();
    
    // Add the current x and y coordinates to the array.
    [currentStroke.x addObject:[NSNumber numberWithFloat:currentPoint.x]];
    [currentStroke.y addObject:[NSNumber numberWithFloat:currentPoint.y]];
    
    lastPoint = currentPoint;
}

- (void)touchesEnded:(NSSet *)touches withEvent:(UIEvent *)event {
    if(!isSwiped) {
        UIGraphicsBeginImageContext(self.view.frame.size);
        [self.drawingBoard.image drawInRect:CGRectMake(0, 0, self.view.frame.size.width, self.view.frame.size.height)];
        CGContextSetLineCap(UIGraphicsGetCurrentContext(), kCGLineCapRound);
        CGContextSetLineWidth(UIGraphicsGetCurrentContext(), 1.0f);
        CGContextSetRGBStrokeColor(UIGraphicsGetCurrentContext(), 0.0, 0.0, 0.0, 1.0);
        CGContextMoveToPoint(UIGraphicsGetCurrentContext(), lastPoint.x, lastPoint.y);
        CGContextAddLineToPoint(UIGraphicsGetCurrentContext(), lastPoint.x, lastPoint.y);
        CGContextStrokePath(UIGraphicsGetCurrentContext());
        CGContextFlush(UIGraphicsGetCurrentContext());
        self.drawingBoard.image = UIGraphicsGetImageFromCurrentImageContext();
        UIGraphicsEndImageContext();
    }
    
    // Add stroke to the strokes array
    [strokes addObject:currentStroke];
    NSLog(@"Strokes on screen: %li", [strokes count]);
    
    // Destroy stroke
    currentStroke = nil;
    
    //Wrap stroke in SLVStroke object and add to strokes array. Send array to Solvit for processing.
    
}

- (void)clearAll {
    // Clears everything on screen and in memory.
    [strokes removeAllObjects];
    self.drawingBoard.image = nil;
    NSLog(@"Cleared.");
    NSLog(@"Strokes on screen: %li", [strokes count]);
}

- (IBAction)clearPressed:(id)sender {
    [self clearAll];
}
@end
