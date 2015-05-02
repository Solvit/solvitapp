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
    
    return self;
}

@end
