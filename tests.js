/*
 * Copyright (c) 2011 Dhruv Matani
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */


var algo = require('./algorithm.js');
var assert = require('assert').ok;

var q = new algo.Queue();
q.push(1, 2, 3, 4, 5, 6);
assert(q.pop() == 1, "pop failed");

q.push(10, 20, 30, 40, 50, 60);
assert(q.top == 2, "top failed");

assert(q.length == 11, "length failed");


var mh = new algo.MinHeap();
mh.push(10, 100, 20, 9, 86, 40, 33, 12, 21, 99, 101, 100);
// console.log(mh);

assert(algo.is_heap(mh._repr), "Not a heap");

var r = mh._repr;
mh._repr = [ ];

algo.heap_sort(r);
assert(algo.is_sorted(r), "Not sorted");

// console.log(r);
var lb, ub;

lb = algo.lower_bound(r, 10);
assert(lb == 1);

lb = algo.lower_bound(r, 20);
assert(lb == 3);

lb = algo.lower_bound(r, 50);
assert(lb == 7);

lb = algo.lower_bound(r, 60);
assert(lb == 7);

lb = algo.lower_bound(r, 70);
assert(lb == 7);

lb = algo.lower_bound(r, 100);
assert(lb == 9);

var r1 = [ 1, 2, 3, 3, 3, 3, 3, 4, 5, 10, 10, 1011, 1011, 1011, 1011, 2002 ];

lb = algo.lower_bound(r1, 0);
assert(lb == 0);

lb = algo.lower_bound(r1, 1);
assert(lb == 0);

lb = algo.lower_bound(r1, 3);
assert(lb == 2);

lb = algo.lower_bound(r1, 2002);
assert(lb == 15);

lb = algo.lower_bound(r1, 2003);
assert(lb == 16);

ub = algo.upper_bound(r, 0);
assert(ub == 0);

ub = algo.upper_bound(r, 10);
assert(ub == 1);

ub = algo.upper_bound(r, 20);
assert(ub == 3);

ub = algo.upper_bound(r, 50);
assert(ub == 6);

ub = algo.upper_bound(r, 70);
assert(ub == 6);

ub = algo.upper_bound(r, 100);
assert(ub == 10);

ub = algo.upper_bound(r, 101);
assert(ub == 11);

ub = algo.upper_bound(r, 102);
assert(ub == 11);


algo.heap_sort(r, algo.cmp_gt);
assert(algo.is_sorted(r, algo.cmp_gt), "Not sorted");

var r2 = [10, 33, 19, 102, 9, 99, 999, 1932, 102, 1992, 8, 88, 888, 88, 8, 0, -1, -2, -2, -1, 0];
var pidx = algo.partition(r2, 100);
assert(pidx == 15);

var r2 = [10, 33, 19, 102, 9, 99, 999, 1932, 102, 1992, 8, 88, 888, 88, 8, 0, -1, -2, -2, -1, 0];
var pidx = algo.partition(r2, 50);
assert(pidx == 12);

var r2 = [10, 33, 19, 102, 9, 99, 999, 1932, 102, 1992, 8, 88, 888, 88, 8, 0, -1, -2, -2, -1, 0];
var pidx = algo.partition(r2, 0);
assert(pidx == 4);

var r2 = [10, 33, 19, 102, 9, 99, 999, 1932, 102, 1992, 8, 88, 888, 88, 8, 0, -1, -2, -2, -1, 0];
var pidx = algo.partition(r2, -10);
assert(pidx == 0);

var r2 = [10, 33, 19, 102, 9, 99, 999, 1932, 102, 1992, 8, 88, 888, 88, 8, 0, -1, -2, -2, -1, 0];
var pidx = algo.partition(r2, 3003);
assert(pidx == 21);

var mmh = new algo.MinMaxHeap(algo.cmp_lt, r2);

assert(mmh.max == 1992);
assert(mmh.min == -2);

var sorted_mmh = [ ];
while (mmh.length > 0) {
	sorted_mmh.push(mmh.pop_max());
}

assert(algo.is_sorted(sorted_mmh, algo.cmp_gt));


mmh = new algo.MinMaxHeap(algo.cmp_lt, r2);
sorted_mmh = [ ];
while (mmh.length > 0) {
	sorted_mmh.push(mmh.pop_min());
}

assert(algo.is_sorted(sorted_mmh, algo.cmp_lt));
