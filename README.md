## Data Structures & Algorithms for Javascript

    var algo = require('algorithm');


### Data Structures:
1. Queue/FIFO Operations & Properties:
    * (constructor) pushes every argument that is passed into the queue
    * push(1, 2, 3, 4): Pushes 4 integers into the queue - O(1)
    * pop(): Removes the earliest value from the queue and returns it - O(1)
    * top: Returns the earliest pushed value without removing it - O(1)
    * length: Returns the number of elements in the queue

        var q = new algo.Queue(1, 2, 3, 4);


2. Stack/FILO/LIFO Operations & Properties:
    * (constructor) pushes every argument that is passed into the stack
    * push(1, 2, 3, 4) - O(1)
    * pop() - O(1)
    * top   - O(1)
    * Indexing (like an array) - O(1)
    * length: Returns the number of elements in the stack

3. MinHeap Operations & Properties:
    * (constructor) takes in an (possibly non-empty) array which will be used for storage
    * push/insert(1, 2, 3, 4): Pushes 4 integers into the heap - O(log n)
    * pop(): Removes the smallest value from the heap and returns it - O(log n)
    * top: Returns the smallest value in the heap without removing it - O(1)
    * length: Returns the number of elements in the heap

4. Similarly, we have MaxHeap as well.

5. There is also a general Heap/PriorityQueue that can be constructed using 
a comparator and an existing array:

	var h = new algo.PriorityQueue(algo.cmp_lt, [92, 19, 192, 11, 0, 3])

6. MinMaxHeap/PriorityDequeue Operations & Properties:
    * (constructor) takes in a less-than comparator and an (possibly non-empty) array 
    which will be used for storage
    * push/insert(1, 2, 3, 4): Pushes 4 integers into the heap - O(log n)
    * pop_min(): Removes the smallest value from the heap and returns it - O(log n)
    * pop_max(): Removes the largest value from the heap and returns it - O(log n)
    * min: Returns the smallest value in the heap without removing it - O(1)
    * max: Returns the largest value in the heap without removing it - O(1)
    * length: Returns the number of elements in the heap

        var mmh = new algo.MinMaxHeap(algo.cmp_lt, [45, 2, 54, 12, 21, 99, 1]);

7. Trie Operations & Properties:
    * insert('str1', 'str2', 'str3'): Pushes 3 strings into the Trie
    * remove('str2'): Removes 'str2' from the Trie. Retrns TRUE if 'str2' was
    removed, and FALSE otherwise
    * remove_many('str1', 'str2', 'str4'): Removes 3 strings from the Trie. Retruns
    the number of items actually removed
    * exists('str4'): Retutns TRUE or FALSE depending upon whether 'str4' exists
    in the trie or not.
    * forEach(callback): Iterates through every element of the Trie in lexicographically
    non-increasing order. The callback gets 2 parameters: The value and the index in
    the lexicographic order of the traversal. (Check the tests.js file for an example
    of this in action)
    * length: Returns the number of elements in the Trie

    A Trie is like a set. Adding an element multiple times does not increase the
    length of the Trie by more than 1.

8. Disjoint Set Operations & Properties:
    * constructor(value): Create a DisjointSet object with a single element 'value'
    * representative: Returns the representative Set for the current Set
    * union: Meld 2 DisjointSet objects into one so that they have the same 
      representative Set
    * length: Returns the number of elements that the representative Set of this
      Set has under it
    * You can find more information about the Disjoint Set Data Structure on these pages:
        * https://secure.wikimedia.org/wikipedia/en/wiki/Disjoint-set_data_structure
        * http://www.topcoder.com/tc?module=Static&d1=tutorials&d2=disjointDataStructure

9. AVL Tree Operations & Properties:
    * constructor(cmp_lt, hook0, hook1, hook2, ...): The 1st argument is a < comparator.
      All subsequent arguments are "hook" functions that are called when the tree is
      rebalanced so that user-level metadata can be updated. See the function test_avl_tree_hooks() 
      in the file 'tests.js' for an example on how to use hook functions.
    * insert(value): O(log n)
    * remove(value): O(log n)
    * find(value):   O(log n)
    * successor(node): Locate the successor of 'node'. The successor of a node is the smallest 
      node in the Tree that is greater than the current node. O(log n)
    * predecessor(node): Locate the predecessor of 'node'. The predecessor of a node is the greatest 
      node in the Tree that is smallest than the current node. O(log n)
    * lower_bound(value): Locate the *first* node before which 'value' can safely be inserted. O(log n)
    * upper_bound(value): Locate the *last* node before which 'value' can safely be inserted. O(log n)
    * find_by_rank(k): Locate the k'th smallest element in the Tree. 1 <= k <= Tree.length. 
      O(log n)
    * forEach(proc): Iterate over every element in the tree in sorted order 
      (in-order traversal). O(n)
    * toGraphviz():  Return a string that can be fed to the Graphviz tool to display
      the AVL Tree as it currently looks. O(n)
    * min:           O(log n)
    * max:           O(log n)
    * length:        The total number of elements in the Tree. O(1)
    * height:        The length of the longest path from root to leaf. O(1)
    * clear:         Empty the Tree. O(1)
    * This AVL Tree can store multiple elements with the *same key*
    * You can find more information about the AVL Tree Data Structure on these pages:
        * http://en.wikipedia.org/wiki/AVL_tree
        * http://en.wikipedia.org/wiki/Tree_rotation
        * http://closure-library.googlecode.com/svn/docs/closure_goog_structs_avltree.js.source.html


### Algorithms:
1. range(range/array, start index, one after end index): Retuns a range of 
values from the passed array. The returned range is also an array. O(n)

2. lower_bound(range, value, cmp_lt): (range MUST be sorted) Returns the first 
location before which 'value' can safely be inserted so that the resulting range is also
sorted. Will return one past the last valid index if value is greater than any 
element in the list. O(log n)

3. upper_bound(range, value, cmp_lt): (range MUST be sorted) Returns the last 
location before which 'value' can safely be inserted so that the resulting range is also
sorted. Will return one past the last valid index if value is greater than any 
element in the list. O(log n)

4. equal_range(range, value, cmp_lt): (range MUST be sorted) Returns the first and
last locations before and after which 'value' can safely be inserted so that the 
resulting range is also sorted. O(log n)

5. binary_search(range, value, cmp_lt): (range MUST be sorted) Returns the first
index where value is equal to the value at index. Returns -1 if the value is not to
be found in the range. O(log n)

6. partition(range, pivot_index, cmp_lt): Partitions a range around the element at 
range[pivot_index] and returns the index in the modified range that corresponds 
to the location before which pivot can be inserted so that the partition remains 
valid.
Time Complexity: O(n)
Space Complexity: O(1)

7. stable_partition: Same as above, but retains the original order of elements for
elements that compare equal.
Time Complexity: O(n)
Space Complexity: O(n)

8. merge(range1, range2, cmp_lt): Merges 2 sorted ranges and returns a new merged
range.
Time Complexity: O(n)
Space Complexity: O(n)

9. is_sorted(range, cmp_lt): Returns true or false depending on whether range 
is sorted according to 'cmp_lt'.

10. is_heap(range, cmp_lt): Returns true or false depending on whether range 
is a heap according to 'cmp_lt'. If 'cmp_gt' is used, then is_heap will check
range for being in Max-Heap order. If 'cmp_lt' is used, it will check for 
range to be in Min-Heap order.

11. heap_sort(input, cmp): Sorts 'input' using comparator 'cmp'. Sorts the
array 'input' in-place. Returns the sorted array. The array passed as 'input' 
WILL be modified. This is an unstable sort - O(n log n)

12. randomized_select(range, k, cmp): Select the k'th smallest element from 
'range' using 'cmp' as the less-than comparator. The expected runtime 
complexity of this function is O(n).


### Comparators:
All Comparators return either true or false only.

1. cmp_lt(lhs, rhs): Returns whatever lhs < rhs returns

2. cmp_gt(lhs, rhs): Uses < to do a > comparison

3. cmp_lt_eq(lhs, rhs): Uses < to do a <= comparison

4. cmp_gt_eq(lhs, rhs): Uses < to do a >= comparison

5. cmp_eq(lhs, rhs): Uses < to do an == comparison

6. cmp_gt_gen(cmp_lt): Given a less-than comparator, generates a greater-than
comparator from it

7. cmp_gt_eq_gen(cmp_lt): Given a less-than comparator, generates a greater-than
or equal to comparator from it

8. cmp_lt_eq_gen(cmp_lt): Given a less-than comparator, generates a less-than
or equal to comparator from it

9. cmp_eq_gen(cmp_lt): Given a less-than comparator, generates an equal to 
comparator from it
