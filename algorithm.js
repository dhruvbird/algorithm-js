//
// Documentation for most of the stuff can be found here:
// http://www.sgi.com/tech/stl/table_of_contents.html
//

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
}

Queue.prototype = {
	push: function(elem) {
		this._push_stack.push(elem);
		if (arguments.length > 1) {
			for (var i = 1; i < arguments.length; ++i) {
				this._push_stack.push(arguments[i]);
			}
		}
	}, 
	pop: function() {
		if (this.length === 0) {
			console.error("INVALID POP");
			throw { message: "Nothing in the Queue to pop" };
		}
		var _top = this.top();
		this._pop_stack.pop();
		return _top;
	}, 
	top: function() {
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
Stack.prototype.top = function() {
	return this.slice(this.length - 1)[0];
}

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
		var _top = this.top();

		// console.log("REPR:", this._repr);

		// We assume that there is at least 1 element in the heap
		var _bot = this._repr.pop();

		if (this.length > 0) {
			this._repr[0] = _bot;
			this._bubble_down(0);
		}
		return _top;
	}, 
	top: function() {
		return this._repr[0];
	}, 
	push: function(elem) {
		this._repr.push(elem);
		this._bubble_up(this.length - 1);
		if (arguments.length > 1) {
			for (var i = 1; i < arguments.length; ++i) {
				this._repr.push(arguments[i]);
				this._bubble_up(this.length - 1);
			}
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
		var t          = this._repr[pi];
		this._repr[pi] = this._repr[ci];
		this._repr[ci] = t;
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
function MinMaxHeap(cmp, repr) {
	this._cmp  = cmp;
	this._repr = repr;
}

MinMaxHeap.prototype = {
};








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
exports.stable_partition = partition;
exports.merge            = merge;
exports.is_sorted        = is_sorted;
exports.is_heap          = is_heap;
