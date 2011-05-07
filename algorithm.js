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


//
// Documentation for most of the stuff can be found here:
// http://www.sgi.com/tech/stl/table_of_contents.html
//

var assert = require('assert').ok;


//
// A queue made out of 2 stacks.
// 
// Amortized cost of push: O(1)
// Amortized cost of pop:  O(1)
// Amortized cost of top:  O(1)
// Cost of remove:         O(n)
//
function Queue() {
	this._push_stack = [];
	this._pop_stack  = [];

	this.push.apply(this, arguments);
}

Queue.prototype = {
	push: function(elem) {
		for (var i = 0; i < arguments.length; ++i) {
			this._push_stack.push(arguments[i]);
		}
	}, 
	pop: function() {
		if (this.length === 0) {
			console.error("INVALID POP");
			throw { message: "Nothing in the Queue to pop" };
		}
		var _top = this.top;
		this._pop_stack.pop();
		return _top;
	}, 
	get top() {
		if (this.length === 0) {
			return;
		}

		if (this._pop_stack.length == 0) {
			this._copy_push_to_pop();
		}

		return this._pop_stack.slice(-1)[0];
	}, 
	remove: function(elem) {
		var _tgt_stack = this._pop_stack;
		var _tgt_index = -1;

		_tgt_index = this._pop_stack.indexOf(elem);
		if (_tgt_index == -1) {
			_tgt_stack = this._push_stack;
			_tgt_index = this._push_stack.indexOf(elem);
		}

		if (_tgt_index != -1) {
			_tgt_stack.splice(_tgt_index, 1);
		}
	}, 
	get length() {
		return this._push_stack.length + this._pop_stack.length;
	}, 
	_copy_push_to_pop: function() {
		this._push_stack.reverse();
		this._pop_stack = this._push_stack;
		this._push_stack = [ ];
	}
};

exports.Queue = Queue;
exports.FIFO  = Queue;


//
// A stack has the following operations:
// push: O(1)
// pop:  O(1)
// top:  O(1)
//
function Stack() {
}

Stack.prototype = new Array();
Stack.prototype.__defineGetter__('top', function () {
	return this.slice(this.length - 1)[0];
});

exports.Stack = Stack;
exports.LIFO  = Stack;
exports.FILO  = Stack;


//
// Comparators:
// Generate GT(>) from LT(<)
//
function cmp_lt(lhs, rhs) {
	return lhs < rhs;
}

function cmp_gt_gen(cmp_lt) {
	return function(lhs, rhs) {
		return cmp_lt(rhs, lhs);
	}
}

function cmp_eq_gen(cmp_lt) {
	return function(lhs, rhs) {
		return !cmp_lt(lhs, rhs) && !cmp_lt(rhs, lhs);
	};
}

function cmp_lt_eq_gen(cmp_lt) {
	var cmp_eq = cmp_eq_gen(cmp_lt);
	return function(lhs, rhs) {
		return cmp_lt(lhs, rhs) || cmp_eq(rhs, lhs);
	};
}

function cmp_gt_eq_gen(cmp_lt) {
	return function(lhs, rhs) {
		return !cmp_lt(lhs, rhs);
	};
}


var cmp_gt    = cmp_gt_gen(cmp_lt);
var cmp_eq    = cmp_eq_gen(cmp_lt);
var cmp_lt_eq = cmp_lt_eq_gen(cmp_lt);
var cmp_gt_eq = cmp_gt_eq_gen(cmp_lt);



function js_cmp_gen(cmp_lt) {
	var cmp_gt = cmp_gt_gen(cmp_lt);
	return function(lhs, rhs) {
		return (cmp_lt(lhs, rhs) ? -1 : (cmp_gt(lhs, rhs) ? 1 : 0));
	};
}

exports.cmp_gt_gen = cmp_gt_gen;
exports.cmp_eq_gen = cmp_eq_gen;
exports.cmp_gt_eq_gen = cmp_gt_eq_gen;
exports.cmp_lt_eq_gen = cmp_lt_eq_gen;

exports.cmp_lt = cmp_lt;
exports.cmp_gt = cmp_gt;
exports.cmp_lt_eq = cmp_lt_eq;
exports.cmp_gt_eq = cmp_gt_eq;
exports.cmp_eq = cmp_eq;




//
// A heap has the following operations:
// push/insert: O(log n)
// pop:         O(log n)
// top:         O(1)
// constructor: O(n log n)
//
function Heap(cmp, repr) {
	this._cmp = cmp || cmp_lt;
	this._repr = repr || [ ];

	if (this._repr.length > 0) {
		this._make_heap();
	}
}

Heap.prototype = {
	pop: function() {
		var _top = this.top;

		// console.log("REPR:", this._repr);

		// We assume that there is at least 1 element in the heap
		var _bot = this._repr.pop();

		if (this.length > 0) {
			this._repr[0] = _bot;
			this._bubble_down(0);
		}
		return _top;
	}, 
	get top() {
		return this._repr[0];
	}, 
	push: function(elem) {
		for (var i = 0; i < arguments.length; ++i) {
			this._repr.push(arguments[i]);
			this._bubble_up(this.length - 1);
		}
	}, 
	get length() {
		return this._repr.length;
	}, 
	_make_heap: function() {
		// Could be made O(n) later. Currently is O(n log n)
		for (var i = 1; i < this._repr.length; ++i) {
			this._bubble_up(i);
		}
	}, 
	_swap: function(pi, ci) {
		return _swap(this._repr, pi, ci);
	}, 
	_bubble_up: function(i) {
		// var don = this._repr[i] == 21;
		while (i > 0) {
			var pi = ((i % 2) == 0 ? i - 2 : i - 1) / 2;

			// If Value at Child is (lt) cmp value at Parent, we swap the 2.
			// if (don) { console.log("bubble up: parent", this._repr[pi], "child", this._repr[i]); }
			if (this._cmp(this._repr[i], this._repr[pi])) {
				// if (don) { console.log("swapped"); }
				this._swap(pi, i);
				i = pi;
			}
			else {
				i = 0;
			}
		}
		// if (don) { console.log("_repr:", this._repr); }
	},
	_bubble_down: function(i) {
		var _eof = false;
		var self = this;

		while (!_eof) {
			_eof = true;
			var ci1 = i * 2 + 1;
			var ci2 = i * 2 + 2;

			var candidates = [ 
				{ index: ci1, value: this._repr[ci1] }, 
				{ index: ci2, value: this._repr[ci2] }
			].filter(function(v) {
				return v.index < self._repr.length;
			});

			candidates.sort(function(lhs, rhs) {
				return js_cmp_gen(self._cmp)(lhs.value, rhs.value);
			});

			// console.log("Candidates:", candidates);

			if (candidates.length > 0) {
				var candidate = candidates[0];

				if (this._cmp(candidate.value, this._repr[i])) {
					// The smallest child is smaller than the value at 'i'.
					// We swap the 2.
					// console.log("swapping", this._repr[i], "with", candidate.value);
					this._swap(i, candidate.index);
					_eof = false;
					i = candidate.index;
				}
			}

		} // while (!_eof)

	} // _bubble_down()

};

Heap.prototype.insert = Heap.prototype.push;



exports.Heap = Heap;
exports.PriorityQueue = Heap;
exports.MinHeap = function(repr) {
	return new Heap(cmp_lt, repr);
};
exports.MaxHeap = function(repr) {
	return new Heap(cmp_gt, repr);
};

// Modifies the array in-place (uses extra memory though)
exports.heap_sort = function(repr, cmp) {
	cmp = cmp || cmp_lt;
	var h = new Heap(cmp, repr);
	var tmp = [ ];
	while (h.length > 0) {
		tmp.push(h.pop());
	}
	tmp.unshift(0, 0);
	repr.splice.apply(repr, tmp);
	return repr;
};

//
// A min-max-heap has the following operations:
// push/insert: O(log n)
// pop_min:     O(log n)
// min:         O(1)
// pop_max:     O(log n)
// max:         O(1)
// constructor: O(n log n)
//
// http://www.cs.otago.ac.nz/staffpriv/mike/Papers/MinMaxHeaps/MinMaxHeaps.pdf
// 
// Note: lt MUST be a < comparator
//
function MinMaxHeap(lt, repr) {
	this._lt   = lt || cmp_lt;
	this._gt   = cmp_gt_gen(this._lt);
	this._repr = repr || [ ];

	if (this._repr.length > 0) {
		this._make_heap();
	}
}

MinMaxHeap.prototype = {
	_make_heap: function() {
		for (var i = 0; i < this._repr.length; ++i) {
			this._bubble_up(i);
			// console.log(this._repr.slice(0, i+1).toString());
		}
	}, 

	_is_level_min_level: function(level) {
		return (level % 2) == 0;
	}, 

	_is_index_min_level: function(i) {
		return this._is_level_min_level(parseInt(Math.log(i+1) / Math.log(2.0)));
	}, 

	_parent_index: function(i) {
		return ((i % 2) == 0 ? i - 2 : i - 1) / 2;
	}, 
	
	_grand_parent_index: function(i) {
		return this._parent_index(this._parent_index(i));
	},

	_bubble_up: function(i) {
		if (i == 0) {
			return;
		}

		var pi = this._parent_index(i);

		if (this._is_index_min_level(i)) {
			if (this._gt(this._repr[i], this._repr[pi])) {
				_swap(this._repr, i, pi);
				this._bubble_up_max(pi);
			}
			else {
				this._bubble_up_min(i);
			}
		}
		else {
			if (this._lt(this._repr[i], this._repr[pi])) {
				_swap(this._repr, i, pi);
				this._bubble_up_min(pi);
			}
			else {
				this._bubble_up_max(i);
			}
		}
	}, 

	_bubble_up_min: function(i) {
		var gpi = this._grand_parent_index(i);
		if (i == 0 || gpi < 0) {
			return;
		}

		if (this._lt(this._repr[i], this._repr[gpi])) {
			_swap(this._repr, i, gpi);
			this._bubble_up_min(gpi);
		}
	}, 

	_bubble_up_max: function(i) {
		var gpi = this._grand_parent_index(i);
		if (i == 0 || gpi < 0) {
			return;
		}

		if (this._gt(this._repr[i], this._repr[gpi])) {
			_swap(this._repr, i, gpi);
			this._bubble_up_max(gpi);
		}
	}, 

	_get_candidate_nodes: function() {
		var ret = [ ];
		for (var i = 0; i < arguments.length; ++i) {
			var index = arguments[i];
			ret.push({
				index: index, 
				value: this._repr[index]
			});
		}
		return ret;
	}, 

	_get_valid_children_and_grand_children: function(i) {
		var opts = this._get_candidate_nodes(i*2+1, i*2+2, 
			(i*2+1)*2 + 1, (i*2+1)*2 + 2, 
			(i*2+2)*2 + 1, (i*2+2)*2 + 2);

		var self = this;
		
		opts = opts.filter(function(opt) {
			return opt.index < self._repr.length;
		});

		return opts;
	}, 

	_bubble_down: function(i) {
		if (this._is_index_min_level(i)) {
			this._bubble_down_min(i);
		}
		else {
			this._bubble_down_max(i);
		}
	}, 

	_bubble_down_min: function(i) {
		var opts = this._get_valid_children_and_grand_children(i);
		var self = this;

		opts.sort(function(lhs, rhs) {
			return js_cmp_gen(self._lt)(lhs.value, rhs.value);
		});

		if (opts.length == 0) {
			return;
		}

		var opt = opts[0];

		if (opt.index < i*2+3 /* Is i a parent or grandparent of opt? */) {
			// Parent
			if (opt.value < this._repr[i]) {
				_swap(this._repr, opt.index, i);
			}
		}
		else {
			// Grandparent
			if (opt.value < this._repr[i]) {
				_swap(this._repr, opt.index, i);
				var _pi = this._parent_index(opt.index);
				if (this._repr[_pi] < this._repr[opt.index]) {
					_swap(this._repr, opt.index, _pi);
				}
				this._bubble_down_min(opt.index);
			}
		}
	}, 

	_bubble_down_max: function(i) {
		var opts = this._get_valid_children_and_grand_children(i);
		var self = this;

		opts.sort(function(lhs, rhs) {
			return js_cmp_gen(self._lt)(lhs.value, rhs.value);
		});

		if (opts.length == 0) {
			return;
		}

		var opt = opts[opts.length - 1];

		if (opt.index < i*2+3 /* Is i a parent or grandparent of opt? */) {
			// Parent
			if (opt.value > this._repr[i]) {
				_swap(this._repr, opt.index, i);
			}
		}
		else {
			// Grandparent
			if (opt.value > this._repr[i]) {
				_swap(this._repr, opt.index, i);
				var _pi = this._parent_index(opt.index);
				if (this._repr[_pi] > this._repr[opt.index]) {
					_swap(this._repr, opt.index, _pi);
				}
				this._bubble_down_max(opt.index);
			}
		}
	}, 
	
	_move_from_end: function(index) {
		if (index < this.length - 1) {
			this._repr[index] = this._repr[this._repr.length - 1];
		}
		this._repr.pop();
		if (index < this.length) {
			this._bubble_down(index);
		}
	},

	get length() {
		return this._repr.length;
	}, 

	_min: function() {
		return { index: 0, value: this._repr[0] };
	}, 
	
	_max: function() {
		if (this.length == 1) {
			return this._min();
		}

		var opts = [
			{ index: 1, value: this._repr[1] }, 
			{ index: 2, value: this._repr[2] }
		];
		var self = this;

		opts = opts.filter(function(opt) {
			return opt.index < self._repr.length;
		});

		opts.sort(function(lhs, rhs) {
			return js_cmp_gen(self._lt)(lhs.value, rhs.value);
		});

		if (opts.length == 0) {
			return;
		}

		var opt = opts[opts.length - 1];

		return opt;
	},

	get min() {
		return this._min().value;
	}, 

	get max() {
		return this._max().value;
	}, 

	push: function(elem) {
		for (var i = 0; i < arguments.length; ++i) {
			this._repr.push(arguments[i]);
			this._bubble_up(this._repr.length - 1);
		}
	},

	pop_min: function() {
		var _min = this._min();
		this._move_from_end(_min.index);
		return _min.value;
	}, 
	
	pop_max: function() {
		var _max = this._max();
		this._move_from_end(_max.index);
		return _max.value;
	}

};

MinMaxHeap.prototype.insert = MinMaxHeap.prototype.push;

exports.MinMaxHeap      = MinMaxHeap;
exports.PriorityDequeue = MinMaxHeap;



//
// A Trie has the following operations:
// insert:      O(length of string to be inserted)
// remove:      O(length of string to be removed)
// remove_many: O(items to be removed * avg. length of each item)
// forEach:     O(n)
//
function Trie() {
	this.root = { lf: false };
	this._length = 0;
}

Trie.prototype = {
	insert: function() {
		for (var i = 0; i < arguments.length; ++i) {
			this._insert(arguments[i]);
		}
	}, 
	
	_insert: function(s) {
		var r = this.root;
		for (var i = 0; i < s.length; ++i) {
			var ch = s[i];
			if (!(ch in r)) {
				r[ch] = { lf: false };
			}
			r = r[ch];
		}

		if (!r.lf) {
			r.lf = true;
			this._length += 1;
		}

	}, 

	remove_many: function() {
		var ret = 0;
		for (var i = 0; i < arguments.length; ++i) {
			ret += (this.remove(arguments[i]) ? 1 : 0);
		}
		return ret;
	}, 

	remove: function(s) {
		var stat = this._remove(s, this.root);
		this._length -= (stat ? 1 : 0);
		return stat;
	}, 

	_remove: function(s, r) {
		if (!r) {
			// console.log("r is falsy, s ==", s);
			return false;
		}

		if (s.length == 0) {
			var lf = r.lf;
			r.lf = false;
			return lf;
		}

		var _r = r[s[0]];
		var stat = this._remove(s.substring(1), _r);

		if (!stat) {
			// console.log("Error removing:", s[0], "from", s, _r);
			return false;
		}

		if (Object.keys(_r).length == 1 && !_r.lf) {
			// We can drop this node
			delete r[s[0]];
		}

		return true;
	}, 

	exists: function(s) {
		return this._exists(s, this.root);
	}, 

	_exists: function(s, r) {
		if (!r) {
			return false;
		}

		if (s.length == 0) {
			return r.lf;
		}

		var _r = r[s[0]];
		return this._exists(s.substring(1), _r);
	}, 
	
	get length() {
		return this._length;
	}, 

	_forEach: function(r, proc, accum, i) {
		if (!r) {
			return 0;
		}

		var _i = 0;
		if (r.lf) {
			proc(accum.join(''), _i + i);
			_i += 1;
		}

		var keys = Object.keys(r);
		keys.sort();
		for (var index in keys) {
			var ch = keys[index];
			if (ch != 'lf') {
				accum.push(ch);
				_i += this._forEach(r[ch], proc, accum, _i + i);
				accum.pop();
			}
		}

		return _i;
	}, 

	forEach: function(proc) {
		this._forEach(this.root, proc, [], 0);
	}

};


exports.Trie = Trie;


//
// The Disjoint Set Data Structure is explained here:
//
// https://secure.wikimedia.org/wikipedia/en/wiki/Disjoint-set_data_structure
// and here:
// http://www.topcoder.com/tc?module=Static&d1=tutorials&d2=disjointDataStructure
//
// and this implementation supports the following operations:
//
// create:         O(1) - The constructor create a DisjointSet with a single element
// representative: O(n) (worst case) - Returns the representative Set for this Set
// union:          O(1) - UNIONs 2 sets into one
//
function DisjointSet(value) {
    this._length = 1;
    this.value = value;
    this.parent = this;
    // console.log("Set ctor:", this);
}

DisjointSet.prototype = {
    representative: function() {
	if (this.parent === this) {
	    return this;
	}

	var p = this.parent.representative();
	this.parent = p;
	return p;
    }, 

    union: function(other_set) {
	var this_rep  = this.representative();
	var other_rep = other_set.representative();
	// console.log("this_rep, other_rep:", this_rep, other_rep);

	if (this_rep === other_rep) {
	    return this_rep;
	}

	// console.log("other_rep.length:", other_rep.length);
	this_rep._length += other_rep.length;
	other_rep.parent = this_rep;

	// console.log("union::returning:", this_rep);
	return this_rep;
    }, 

    get length() {
	var len = this.representative()._length;
	// console.log("length:", len);
	return len;
    }
};


exports.DisjointSet = DisjointSet;


// An AVL Tree Node
function AVLTreeNode(value, parent, height, weight, left, right) {
    this.value  = value;
    this.parent = parent;
    this.height = height;
    this.weight = weight;
    this.left   = left;
    this.right  = right;
}

//
// An AVL tree is a Height Balanced Binary Search Tree
// 
// insert: O(log n)
// remove: O(log g)
// find:   O(log g)
// min:    O(log g)
// max:    O(log g)
// find_by_rank: O(log n)
// clear:  O(1)
// length: O(1)
// height: O(1)
// forEach: O(n) (performs an in-order traversal)
// toGraphviz: O(n) Returns a string that can be fed to Graphviz to 
//                  draw a Tree
//
// References:
// http://en.wikipedia.org/wiki/AVL_tree
// http://en.wikipedia.org/wiki/Tree_rotation
// http://closure-library.googlecode.com/svn/docs/closure_goog_structs_avltree.js.source.html
//
function AVLTree(_cmp_lt) {
    this.cmp_lt = _cmp_lt || cmp_lt;
    this.cmp_eq = cmp_eq_gen(this.cmp_lt);
    this.hooks = [ ];
    for (var i = 1; i < arguments.length; ++i) {
	this.hooks.push(arguments[i]);
    }
    this.root = null;
}

AVLTree.prototype = {
    insert: function(value) {
	if (!this.root) {
	    this.root = new AVLTreeNode(value, null, 0, 1, null, null);
	}
	else {
	    var nodes = this._find_node(value);
	    if (nodes.node) {
		// We found a node with the same key
		return;
	    }

	    // console.log("\ninsert::nodes:", nodes);

	    var nn = new AVLTreeNode(value, nodes.prev, 0, 1, null, null);
	    if (this.cmp_lt(value, nodes.prev.value)) {
		// value < nodes.prev.value
		nodes.prev.left = nn;
	    }
	    else {
		// value > nodes.prev.value
		nodes.prev.right = nn;
	    }

	    this._rebalance_to_root(nn);
	}
    }, 

    remove: function(value) {
	var nodes = this._find_node(value);
	if (!nodes.node) {
	    return;
	}

	this._remove(nodes.node);
    }, 
    
    find: function(value) {
	var nodes = this._find_node(value);
	return nodes.node;
    }, 

    find_by_rank: function(rank) {
	return this._find_by_rank(this.root, rank);
    }, 

    clear: function() {
	this.root = null;
    },

    toGraphviz: function() {
	// Returns a grpahviz consumable tree for plotting
	var graph = [ 'fontname=arial', 'node [fontname=arial,fontsize=10]', 'digraph {' ];
	var nodes = [ ];
	var edges = [ ];

	this.forEach(function(value, node) {
	    if (node.parent) {
		edges.push('"' + node.parent.value + '"->"' + node.value + '"');
	    }
	    nodes.push('"' + node.value + '"');
	});

	if (edges.length > 0) {
	    edges.push('');
	}

	graph.push(nodes.join(', '), '}');
	graph.push(edges.join('; '), '');
	return graph.join('\n');
    }, 

    forEach: function(proc) {
	this._forEach(this.root, proc);
    }, 

    // TODO: Add functions:
    // lower_bound
    // upper_bound

    _forEach: function(node, proc) {
	if (node) {
	    this._forEach(node.left, proc);
	    proc(node.value, node);
	    this._forEach(node.right, proc);
	}
    }, 

    _find_by_rank: function(node, rank) {
	if (rank > node.weight) {
	    return null;
	}

	var lw = this._has_left_child(node) ? node.left.weight : 0;
	var rw = this._has_right_child(node) ? node.right.weight : 0;

	if (rank <= lw) {
	    return this._find_by_rank(node.left, rank);
	}
	else if (rank > lw + 1) {
	    return this._find_by_rank(node.right, rank - lw - 1);
	}
	else {
	    // Must be the root
	    return node.value;
	}
    }, 

    _remove: function(node) {
	// console.log("_remove::node:", node);

	var is_leaf = this._is_leaf(node);
	var has_one_child = this._has_one_child(node);

	// console.log("is_leaf, has_one_child:", is_leaf, has_one_child);

	if (is_leaf || has_one_child) {
	    if (is_leaf) {
		// console.log("Node:", node, "is a leaf");
		if (this._is_root(node)) {
		    this.root = null;
		}
		else {
		    if (this._is_left_child(node)) {
			// console.log("Setting left child of:", node.parent, "to null");
			node.parent.left = null;
		    }
		    else {
			node.parent.right = null;
		    }
		    this._rebalance_to_root(node.parent);
		}
	    }
	    else {
		// Only 1 child
		var tgt_node = null;
		if (this._has_left_child(node)) {
		    tgt_node = node.left;
		}
		else {
		    tgt_node = node.right;
		}

		if (this._is_root(node)) {
		    this.root = tgt_node;
		    // No need to re-balance since this case can occur only 
		    // if the tree has just 2 nodes
		}
		else {
		    if (this._is_left_child(node)) {
			node.parent.left = tgt_node;
		    }
		    else {
			node.parent.right = tgt_node;
		    }
		}
		if (tgt_node) {
		    tgt_node.parent = node.parent;
		}
		this._rebalance_to_root(node.parent);
	    }
	}
	else {
	    // Has 2 children. Find the successor of this node, 
	    // delete that node and replace the value of this 
	    // node with that node's value
	    var replacement = this._successor_of(node);
	    // console.log("replacement:", replacement);
	    this._remove(replacement);
	    node.value = replacement.value;
	}
    }, 

    // TODO: Add methods successor & predecessor so that external consumers
    // can also use them
    _successor_of: function(node) {
	// FIXME: Make it work for all sorts of nodes.
	// Currently, this function requires 'node' to have a right child
	assert(!!node.right);
	node = node.right;
	while (node && node.left) {
	    node = node.left;
	}
	return node;
    }, 

    _is_leaf: function(node) {
	return !node.left && !node.right;
    }, 

    _has_one_child: function(node) {
	return this._has_left_child(node) + this._has_right_child(node) == 1;
    }, 

    _has_left_child: function(node) {
	return !!node.left;
    }, 

    _has_right_child: function(node) {
	return !!node.right;
    }, 

    _update_metadata: function(node) {
	if (!node) {
	    return;
	}

	var height = Math.max(
	    (node.left  ? node.left.height  : 0), 
	    (node.right ? node.right.height : 0)
	) + 1;

	var weight = (node.left ? node.left.weight : 0) + 
	    (node.right ? node.right.weight : 0) + 1;

	// console.log("\nvalue, height, weight:", node.value, height, weight);
	node.height = height;
	node.weight = weight;

	// Provide a set of "hook" methods to the user so that the user may
	// add custom fields to the AVLTreeNode. Useful for doing stuff like:
	// sum, min, max in O(1)
	this.hooks.forEach(function(hook) {
	    hook(node);
	});

    }, 

    _update_metadata_upto_root: function(node) {
	while (node) {
	    this._update_metadata(node);
	    node = node.parent;
	}
    }, 

    _is_root: function(node) {
	return !node.parent;
    }, 

    _is_left_child: function(node) {
	if (!node) {
	    return false;
	}
	return node.parent.left === node;
    }, 

    _is_right_child: function(node) {
	if (!node) {
	    return false;
	}
	return node.parent.right === node;
    }, 

    _find_node: function(value) {
	var node = this.root;
	var prev = null;

	while (node && !this.cmp_eq(node.value, value) /* node.value != value */) {
	    prev = node;
	    if (this.cmp_lt(value, node.value)) {
		node = node.left;
	    }
	    else {
		node = node.right;
	    }
	}

	return { prev: prev, node: node };
    }, 

    _rotate_left: function(node) {
	if (!node) {
	    return;
	}
	assert(node.right !== null);
	var tmp = node.right;

	if (this._is_root(node)) {
	    this.root = node.right;
	    this.root.parent = null;
	}
	else if (this._is_left_child(node)) {
	    node.parent.left = node.right;
	    node.right.parent = node.parent;
	}
	else {
	    // Must be a right child
	    node.parent.right = node.right;
	    node.right.parent = node.parent;
	}

	node.right = tmp.left;
	if (tmp.left) {
	    tmp.left.parent = node;
	}
	tmp.left = node;
	node.parent = tmp;

	this._update_metadata(node);
	this._update_metadata(tmp);
    }, 

    _rotate_right: function(node) {
	if (!node) {
	    return;
	}
	assert(node.left !== null);
	var tmp = node.left;

	if (this._is_root(node)) {
	    this.root = tmp;
	    this.root.parent = null;
	}
	else if (this._is_left_child(node)) {
	    node.parent.left = tmp;
	    tmp.parent       = node.parent;
	}
	else {
	    // Must be a right child
	    node.parent.right = tmp;
	    tmp.parent        = node.parent;
	}

	node.left = tmp.right;
	if (tmp.right) {
	    tmp.right.parent = node;
	}
	tmp.right = node;
	node.parent = tmp;

	this._update_metadata(node);
	this._update_metadata(tmp);
    }, 

    _balance_factor: function(node) {
	if (!node) {
	    return 0;
	}

	var lh = node.left  ? node.left.height  : 0;
	var rh = node.right ? node.right.height : 0;

	// console.log("_balance_factor::of:", node.value, "is:", lh-rh);
	return lh - rh;
    }, 

    _rebalance_to_root: function(node) {
	while (node) {
	    this._rebalance(node);
	    node = node.parent;
	}
    }, 

    _rebalance: function(node) {
	this._update_metadata(node);
	var bf = this._balance_factor(node);
	var _bf;

	if (bf > 1) {
	    // Do a right rotation since the left subtree is > the right subtree
	    _bf = this._balance_factor(node.left);
	    if (_bf < 0) {
		this._rotate_left(node.left);
	    }
	    this._update_metadata(node.left);
	    this._rotate_right(node);
	}
	else if (bf < -1) {
	    // Do a left rotation since the right subtree is > the left subtree
	    _bf = this._balance_factor(node.right);
	    if (_bf > 0) {
		this._rotate_right(node.right);
	    }
	    this._update_metadata(node.right);
	    this._rotate_left(node);
	}

	// update metadata for 'node'
	this._update_metadata(node);
    }
};

AVLTree.prototype.__defineGetter__('height', function() {
    return this.root ? this.root.height : 0;
});

AVLTree.prototype.__defineGetter__('length', function() {
    return this.root ? this.root.weight : 0;
});

AVLTree.prototype.__defineGetter__('min', function() {
    return this.length ? this.find_by_rank(1) : null;
});

AVLTree.prototype.__defineGetter__('max', function() {
    return this.length ? this.find_by_rank(this.length) : null;
});

exports.AVLTree = AVLTree;





function _swap(range, i, j) {
	var t = range[i];
	range[i] = range[j];
	range[j] = t;
}

//
// A range [begin, end)
// 
// A range is a sub-range of another range.
// It just calls the slice function on the underlying range.
// Can be used on an array or an arguments object.
//
function range(range, begin, end) {
	return Array.prototype.slice.call(range, begin, end);
}


function lower_bound(range, value, cmp_lt) {
	/* Returns an index before which it is safe to insert 'value'
	 * such that the 'range' remains sorted
	 */
	if (range.length === 0) {
		return 0;
	}

	cmp_lt = cmp_lt || exports.cmp_lt;
	var cmp_gt_eq = cmp_gt_eq_gen(cmp_lt);

	var b = 0;
	var e = range.length;

	while (e - b > 1) {
		var m = parseInt(b + (e-b) / 2);
		// console.log("b, m, e:", b, m, e);

		if (cmp_lt_eq(value, range[m])) {
			// Value is <= value in the middle. Search in the left half before m.
			e = m;
		}
		else {
			// Value is > value in the middle. Search in the right half including m.
			b = m;
		}
	}

	var cmp_eq = cmp_eq_gen(cmp_lt);

	if (b == range.length) {
		return b;
	}
	else {
		// The value is either the valiue at 'b' or at 'b+1' (if it is a valid index).
		if (cmp_gt_eq(range[b], value)) {
			return b;
		}
		else {
			return b+1;
		}
	}
}

function upper_bound(range, value, cmp_lt) {
	/* Returns an index after which it is safe to insert 'value'
	 * such that the 'range' remains sorted
	 */
	if (range.length === 0) {
		return 0;
	}

	cmp_lt = cmp_lt || exports.cmp_lt;

	var b = 0;
	var e = range.length;

	while (e - b > 1) {
		var m = parseInt(b + (e-b) / 2);
		// console.log("b, m, e:", b, m, e);

		if (cmp_lt(value, range[m])) {
			// Value is < value in the middle. Search in the left half before m.
			e = m;
		}
		else {
			// Value is >= value in the middle. Search in the right half including m.
			b = m;
		}
	}

	if (b == range.length) {
		return b - 1;
	}
	else {
		return b;
	}
}

function equal_range(range, value, cmp_lt) {
	var lb = lower_bound(range, value, cmp_lt);
	var ub = upper_bound(range, value, cmp_lt);
	return [ lb, ub ];
}


// Time Complexity:  O(log n)
// Space Complexity: O(1)
function binary_search(range, value, cmp_lt) {
	var lb = lower_bound(range, value, cmp_lt);
	if (lb == range.length) {
		return -1;
	}
	return cmp_eq_gen(cmp_lt)(range[lb], value) ? lb : -1;
}

// Time Complexity:  O(n)
// Space Complexity: O(1)
// Note: This function is unstable
function partition(range, pivot, cmp_lt) {
	cmp_lt = cmp_lt || exports.cmp_lt;

	if (range.length === 0) {
		return range;
	}

	var l = 0;
	var u = range.length - 1;

	while (true) {
		while (l < u && cmp_lt(range[l], pivot)) {
			l += 1;
		}

		while (l < u && !cmp_lt(range[u], pivot)) {
			u -= 1;
		}

		if (l >= u) {
			break;
		}

		_swap(range, u, l);
		l += 1;
		u -= 1;
	}

	if (l < range.length && cmp_lt_eq_gen(cmp_lt)(range[l], pivot)) {
		return l + 1;
	}
	else {
		return l;
	}
}

// Time Complexity:  O(n)
// Space Complexity: O(n)
function stable_partition(range, pivot, cmp_lt) {
	var p1 = [ ];
	var p2 = [ ];

	for (var i = 0; i < range.length; ++i) {
		(cmp_lt(range[i], pivot) ? p1 : p2).push(range[i]);
	}
	range.splice(0, range.length, p1.concat(p2));
	return range;
}

// Time Complexity:  O(n)
// Space Complexity: O(n)
function merge(range1, range2, cmp_lt) {
	cmp_lt = cmp_lt || exports.cmp_lt;
	var ret = [ ];
	var i1 = 0;
	var i2 = 0;

	while (i1 < range1.length && i2 < range2.length) {
		if (cmp_lt(range1[i1], range2[i2])) {
			ret.push(range1[i1]);
			i1 += 1;
		}
		else {
			ret.push(range2[i2]);
			i2 += 1;
		}
	}

	while (i1 < range1.length) {
		ret.push(range1[i1]);
		i1 += 1;
	}

	while (i2 < range2.length) {
		ret.push(range2[i2]);
		i2 += 1;
	}

	return ret;
}


function is_sorted(range, cmp) {
	cmp = cmp || cmp_lt;
	for (var i = 1; i < range.length; ++i) {
		if (cmp(range[i], range[i-1])) {
			return false;
		}
	}
	return true;
}

function is_heap(range, cmp) {
	cmp = cmp || cmp_lt;
	for (var i = 0; i < range.length; ++i) {
		var ci1 = i * 2 + 1;
		var ci2 = i * 2 + 2;

		if ((ci1 < range.length && cmp(range[ci1], range[i])) || 
			(ci2 < range.length && cmp(range[ci2], range[i]))) {
			return false;
		}
	}
	return true;
}


exports.range            = range;
exports.lower_bound      = lower_bound;
exports.upper_bound      = upper_bound;
exports.equal_range      = equal_range;
exports.binary_search    = binary_search;
exports.partition        = partition;
exports.stable_partition = stable_partition;
exports.merge            = merge;
exports.is_sorted        = is_sorted;
exports.is_heap          = is_heap;

// TODO: String processing algorithms
