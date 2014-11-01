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


function test_queue() {
    var q = new algo.Queue();
    q.push(1, 2, 3, 4, 5, 6);
    assert(q.pop() == 1, "pop failed");

    q.push(10, 20, 30, 40, 50, 60);
    assert(q.top == 2, "top failed");
    
    assert(q.length == 11, "length failed");
}

function test_min_heap() {
    var mh = new algo.MinHeap();
    mh.push(10, 100, 20, 9, 86, 40, 33, 12, 21, 99, 101, 100);
    // console.log(mh);

    assert(algo.is_heap(mh._repr), "Not a heap");
    
    var r = mh._repr;
    mh._repr = [ ];
    
    algo.heap_sort(r);
    assert(algo.is_sorted(r), "Not sorted");
}

function test_max_heap() {
    var r = [ 10, 100, 20, 9, 86, 40, 33, 12, 21, 99, 101, 100 ];

    // Sort in non-increasing order
    r.sort(function(x,y) { return y-x; });

    algo.heap_sort(r, algo.cmp_gt);
    assert(algo.is_sorted(r, algo.cmp_gt), "Not sorted");
}

function test_functions() {
    var r = [ 10, 100, 20, 9, 86, 40, 33, 12, 21, 99, 101, 100 ];

    // Sort in non-decreasing order
    r.sort(function(x,y) { return x-y; });

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

    ub = algo.upper_bound(r, 0);
    assert(ub == 0);

    ub = algo.upper_bound(r, 10);
    assert(ub == 2);

    ub = algo.upper_bound(r, 20);
    assert(ub == 4);

    ub = algo.upper_bound(r, 50);
    assert(ub == 7);

    ub = algo.upper_bound(r, 70);
    assert(ub == 7);

    ub = algo.upper_bound(r, 100);
    assert(ub == 11);

    ub = algo.upper_bound(r, 101);
    assert(ub == 12);

    ub = algo.upper_bound(r, 102);
    assert(ub == 12);


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

    var r2 = [ 782, 1, 21, 3, 11, 29, 23, 22, 829, 91, 90, 89, 45, 46, 47, 19, 201, 191 ];
    var pidx = algo.partition(r2, 12);
    assert(pidx == 8);

    var r2 = [10, 33, 19, 102, 9, 99, 999, 1932, 102, 1992, 8, 88, 888, 88, 8, 0, -1, -2, -2, -1, 0];
    var pidx = algo.partition(r2, 3);
    assert(pidx == 16);

    var r2 = [10, 33, 19, 102, 9, 99, 999, 1932, 102, 1992, 8, 88, 888, 88, 8, 0, -1, -2, -2, -1, 0];
    var pidx = algo.partition(r2, 5);
    assert(pidx == 14);

    var r2 = [10, 33, 19, 102, 9, 99, 999, 1932, 102, 1992, 8, 88, 888, 88, 8, 0, -1, -2, -2, -1, 0];
    var pidx = algo.partition(r2, 20);
    assert(pidx == 5);

    var r2 = [10, 33, 19, 102, 9, 99, 999, 1932, 102, 1992, 8, 88, 888, 88, 8, 0, -1, -2, -2, -1, 0];
    var pidx = algo.partition(r2, 0);
    assert(pidx == 9);

    var r2 = [10, 33, 19, 102, 9, 99, 999, 1932, 102, 1992, 8, 88, 888, 88, 8, 0, -1, -2, -2, -1, 0];
    var pidx = algo.partition(r2, 9);
    assert(pidx == 20);
}


function test_min_max_heap() {
    var r2 = [10, 33, 19, 102, 9, 99, 999, 1932, 102, 1992, 8, 88, 888, 88, 8, 0, -1, -2, -2, -1, 0];
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
}

function test_trie() {
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
}

test_queue();
test_min_heap();
test_max_heap();
test_functions();
test_min_max_heap();
test_trie();

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


function is_a_BST(t) {
    var a = [ ];
    t.forEach(function(v) {
	a.push(v);
    });
    // console.log("a:", a);
    return algo.is_sorted(a);
}

function test_avl_tree() {
    var t = new algo.AVLTree();
    t.insert(100);
    t.insert(200);
    t.insert(50);
    t.insert(20);
    t.insert(10);
    t.insert(1);
    t.insert(2);
    t.insert(3);

    // console.log("\nTree after insertion:", util.inspect(t.root, false, 10));

    // console.log(t.toGraphviz());
    assert(is_a_BST(t));
    var s = [ 1, 2, 3, 10, 20, 50, 100, 200 ];

    // console.log("Graphviz:\n", t.toGraphviz());

    for (var i = 0; i < t.length; ++i) {
	// console.log("rank:", i+1, t.find_by_rank(i+1));
	assert(t.find_by_rank(i+1) == s[i]);
    }

    assert(t.lower_bound(40).value == 50);
    assert(t.upper_bound(40).value == 50);

    assert(t.lower_bound(60).value == 100);
    assert(t.upper_bound(60).value == 100);

    // console.log("GW:", t.toGraphviz());
    // console.log(t.lower_bound(100).value);
    assert(t.lower_bound(100).value == 100);
    assert(t.upper_bound(100).value == 200);

    assert(t.lower_bound(0).value == 1);
    assert(t.upper_bound(0).value == 1);

    assert(!t.lower_bound(1000));
    assert(!t.upper_bound(1000));

    t.remove(20);

    // console.log("\nTree after removal:", util.inspect(t.root, false, 10));

    assert(is_a_BST(t));
    var s = [ 1, 2, 3, 10, 50, 100, 200 ];

    for (var i = 0; i < t.length; ++i) {
	// console.log("rank:", i+1, t.find_by_rank(i+1));
	assert(t.find_by_rank(i+1) == s[i]);
    }

    t = new algo.AVLTree();
    for (var i = 0; i < 1000; ++i) {
	t.insert(i);
    }

    // console.log("height, weight:", t.height, t.length);
    assert(t.height == 10);
    assert(t.length == 1000);

    var prev = 0;
    var next = t.find(1);
    while (next) {
	// console.log(next.value);
	assert(prev < next.value);
	prev = next.value;
	next = t.successor(next);
    }

    next = 1000;
    prev = t.find(999);
    while (prev) {
	// console.log(next.value);
	assert(prev.value < next);
	next = prev.value;
	prev = t.predecessor(prev);
    }

    for (var i = 0; i < 1000; ++i) {
	t.remove(i);
    }

    // console.log(t);
    // console.log("height, weight:", t.height, t.length);
    assert(t.height == 0);
    assert(t.length == 0);
}

function test_avl_tree_hooks() {
    function obj_lt(lhs, rhs) {
	var v1 = lhs.hasOwnProperty('key') ? lhs.key : lhs;
	var v2 = rhs.hasOwnProperty('key') ? rhs.key : rhs;
	return v1 < v2;
    }

    function binary_tree_summer(node) {
	var _s = (node.left ? node.left.sum : 0) + 
	    (node.right ? node.right.sum : 0) + node.value.key;
	node.sum = _s;
	// console.log("key, sum:", node.value.key, _s);
    }

    var t = new algo.AVLTree(obj_lt, binary_tree_summer);
    t.insert({ key: 45, value: "frodo" });
    t.insert({ key: 40, value: "harry" });
    t.insert({ key: 55, value: "patricia" });
    t.insert({ key: 105, value: "newton" });
    t.insert({ key: 30, value: "einstein" });
    t.insert({ key: 15, value: "charles" });
    t.insert({ key: 100, value: "knuth" });

    // console.log(t.root);
    // console.log("Sum:", t.root.sum);
    assert(t.root.sum == 390);

    // console.log("Tree:", t.root);

    function query_sum(node, value) {
	// We do the query like we do for a Segment Tree
	if (!node) {
	    return 0;
	}

	// console.log("query_sum:", node.value.key);

	if (node.value.key <= value) {
	    var sub = node.right ? node.right.sum : 0;
	    // console.log("sub:", sub);
	    // console.log("_qs:", query_sum(node.right, value));
	    return node.sum - sub + query_sum(node.right, value);
	}
	else {
	    // node.value.key > value
	    return query_sum(node.left, value);
	}
    }

    // Sum of all numbers <= 40
    var tmp = query_sum(t.root, 40);
    assert(tmp == 85);

    // Sum of all numbers <= 45
    var tmp = query_sum(t.root, 45);
    assert(tmp == 130);


    // Sum of all numbers <= 300
    var tmp = query_sum(t.root, 300);
    assert(tmp == 390);

    // Sum of all numbers <= 100
    var tmp = query_sum(t.root, 100);
    assert(tmp == 285);

    // Sum of all numbers <= 5
    var tmp = query_sum(t.root, 5);
    assert(tmp == 0);
}

function test_avl_tree_multimap() {
    var items = [ 4, 9, 2, 5, 4, 2, 1, 2, 3, 2, 1, 7, 3, 2 ];

    function binary_tree_summer(node) {
	var _s = (node.left ? node.left.sum : 0) + 
	    (node.right ? node.right.sum : 0) + node.value;
	node.sum = _s;
    }


    var tree = new algo.AVLTree(algo.cmp_lt, binary_tree_summer);
    for (var i = 0; i < items.length; ++i) {
	tree.insert(items[i]);
	// console.log("Items:", tree.items());
	// console.log("Graphviz:", tree.toGraphviz());
    }

    var lb = tree.lower_bound(1);
    // console.log("lb(1+0):", lb.value);
    assert(lb.value == 1);

    lb = tree.successor(lb);
    assert(lb.value == 1);
    // console.log("lb(1+1):", lb.value);

    lb = tree.successor(lb);
    assert(lb.value == 2);
    // console.log("lb(1+2):", lb.value);

    var ub = tree.upper_bound(1);
    assert(ub.value == 2);
    // console.log("ub(1+0):", ub.value);

    ub = tree.successor(ub);
    assert(ub.value == 2);
    // console.log("ub(1+1):", ub.value);

    ub = tree.upper_bound(2);
    assert(ub.value == 3);
    // console.log("ub(2+0):", ub.value);

    var tmp = tree.predecessor(ub);
    assert(tmp.value == 2);
    // console.log("ub(2-1):", tmp.value);

    ub = tree.successor(ub);
    assert(ub.value == 3);
    // console.log("ub(2+1):", ub.value);


    function query_sum(node, value) {
	// We do the query like we do for a Segment Tree
	if (!node) {
	    return 0;
	}

	// console.log("query_sum:", node.value.key);

	if (node.value <= value) {
	    var sub = node.right ? node.right.sum : 0;
	    // console.log("sub:", sub);
	    // console.log("_qs:", query_sum(node.right, value));
	    return node.sum - sub + query_sum(node.right, value);
	}
	else {
	    // node.value > value
	    return query_sum(node.left, value);
	}
    }

    // console.log("<= 0:", query_sum(tree.root, 0));
    // console.log("<= 1:", query_sum(tree.root, 1));
    // console.log("<= 2:", query_sum(tree.root, 2));
    // console.log("<= 3:", query_sum(tree.root, 3));
    // console.log("<= 4:", query_sum(tree.root, 4));
    // console.log("<= 7:", query_sum(tree.root, 7));
    // console.log("<= 9:", query_sum(tree.root, 9));
    // console.log("<= 20:", query_sum(tree.root, 20));

    assert(query_sum(tree.root, 0) === 0);
    assert(query_sum(tree.root, 1) === 2);
    assert(query_sum(tree.root, 2) === 12);
    assert(query_sum(tree.root, 3) === 18);
    assert(query_sum(tree.root, 4) === 26);
    assert(query_sum(tree.root, 7) === 38);
    assert(query_sum(tree.root, 9) === 47);
    assert(query_sum(tree.root, 20) === 47);
}


test_avl_tree();
test_avl_tree_hooks();
test_avl_tree_multimap();


function test_randomized_select() {
    for (var i = 0; i < 500; ++i) {
	var r = [ 782, 1, 21, 3, 11, 29, 23, 22, 829, 91, 90, 89, 45, 46, 47, 19, 201, 191 ];
	var v = algo.randomized_select(r, Math.floor(r.length/2));
	// console.log("randomized_select::median:", v);
	// console.log("sorted:", r.sort(algo.js_cmp_gen(algo.cmp_lt)));
	assert(v == 45);
    }
}

test_randomized_select();

function test_stable_partition() {
    // 2 elements with the same key (30 in this case) should not
    // change their relative positions.
    var a = [ [ 30, 0 ], [ 20, 1 ], [ 20, 2 ],
              [ 1, 3 ],  [ 5, 4 ],  [ 11, 5 ],
              [ 30, 6 ], [ 40, 7 ], [ 10, 8 ] ];
    var ret_idx = algo.stable_partition(a, 6, function(lhs, rhs) {
        return lhs[0] < rhs[0];
    });
    for (var i = 0; i < a.length; ) {
        var j;
        for (j = i + 1; j < a.length; ++j) {
            if (a[i][0] != a[j][0]) break;
        }
        if (!algo.is_sorted(algo.range(a, i, j), function(lhs, rhs) {
            return lhs[1] < rhs[1];
        })) {
            console.log("In partitioned array:\n", a);
            console.log("\nThis is not a stable range:\n", algo.range(a, i, j));
            assert(false);
        }
        i = j;
    }
    assert(ret_idx == 6);
}

test_stable_partition();
