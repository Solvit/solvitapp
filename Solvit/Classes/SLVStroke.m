//
//  SLVStroke.m
//  Solvit
//
//  Created by Stuart Farmer on 5/2/15.
//  Copyright (c) 2015 Solvit. All rights reserved.
//

#import "SLVStroke.h"

@implementation SLVStroke

-(id) init {
    self = [super init];
    if( !self ) return nil;
    
    // Custom init
    
    self.type = @"stroke";
    self.row = 1;
    
    self.x = [[NSMutableArray alloc] init];
    self.y = [[NSMutableArray alloc] init];
    
    return self;
}

@end
