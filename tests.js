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


var algo   = require('./algorithm.js');
var assert = require('assert').ok;
var util   = require('util');


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

var t = new algo.Trie();
t.insert('alros', 'algos', 'alg', 'GET', 'GEL', 'POST');

var tiv = [ ];
t.forEach(function(e, i) {
	tiv.push({ value: e, index: i });
});

assert(tiv[0].value === "GEL");
assert(tiv[0].index === 0);

assert(tiv[1].value === "GET");
assert(tiv[1].index === 1);

assert(tiv[2].value === "POST");
assert(tiv[2].index === 2);

assert(tiv[3].value === "alg");
assert(tiv[3].index === 3);

assert(tiv[4].value === "algos");
assert(tiv[4].index === 4);

assert(tiv[5].value === "alros");
assert(tiv[5].index === 5);


// console.log(util.inspect(t, false, 10));
assert(t.length == 6);

assert(t.exists('GE') == false);
assert(t.exists('GET') == true);
assert(t.exists('') == false);

assert(t.remove('GE') == false);
assert(t.remove('GET') == true);

// console.log("Trie length:", t.length);
assert(t.length == 5);

assert(t.exists('GE') == false);
assert(t.exists('GET') == false);
assert(t.exists('GEL') == true);

// console.log(util.inspect(t, false, 10));

assert(t.remove_many('alros', 'algos', 'alg', 'GET', 'GEL', 'POST') == 5);

// console.log(util.inspect(t, false, 10));

assert(t.length == 0);

function test_set(n) {
    var set = null;
    var hash = { };
    for (var i = 0; i < n; ++i) {
	var tmp = new algo.DisjointSet(i);
	hash[i] = tmp;

	if (!set) {
	    set = tmp;
	}
	else {
	    set = set.union(tmp);
	}
	// console.log("make_set::set:", set);
    }
    return hash;
}

var hash = test_set(10);
var keys = Object.keys(hash);
keys.forEach(function(key) {
    assert(hash[key].parent === hash[0]);
});
