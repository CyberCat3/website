class LinkedList {
	constructor() {
		this.head = null;
		this.tail = null;
	}

	init(value) {
		this.tail = this.head = new LinkedListNode(value);
	}

	push(value) {
		if (this.head == null || this.tail == null) {
			this.init(value);
		} else {
			this.head = this.head.addNext(new LinkedListNode(value));
		}
	}

	pop() {
		let head = this.head;
		if (head.prev == null) {
			this.head = null;
			this.tail = null;
		} else {
			head.prev.next = null;
		}
		this.head = head.prev;
		return head.value;
	}

	popTail() {
		let tail = this.tail;
		if (tail.next == null) {
			this.tail == null;
			this.head == null;
		} else {
			tail.next.prev = null;
		}
		this.tail = tail.next;
		return tail.value;
	}

	pushTail(value) {
		if (this.head == null || this.tail == null) {
			this.init(value);
		} else {
			this.tail = this.tail.addPrev(new LinkedListNode(value));
		}
	}

	forEach(callback) {
		let currNode = this.tail;
		while (currNode != null) {
			callback(currNode.value);
			currNode = currNode.next;
		}
	}

	forEachReverse(callback) {
		let currNode = this.head;
		while (currNode != null) {
			callback(currNode.value);
			currNode = currNode.prev;
		}
	}
}

class LinkedListNode {
	constructor(value) {
		this.prev = null;
		this.value = value;
		this.next = null;
	}

	addNext(next) {
		this.next = next;
		next.prev = this;
		return next;
	}

	addPrev(prev) {
		this.prev = prev;
		prev.next = this;
		return prev;
	}
}



console.log("linkedlist.js loaded");