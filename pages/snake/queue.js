class Queue {
	constructor(maxSize) {
		this.backingArray = [];
		this.dequeIndex = 0;
		this.queueIndex = 0;
		this.length = (maxSize ? maxSize : 12);
		this.elementsLeft = 0;
	}

	queue(val) {
		this.backingArray[this.queueIndex] = val;
		this._incrementQueueIndex();
		++this.elementsLeft;
	}

	deque() {
		let val = this.backingArray[this.dequeIndex];
		this._incrementDequeIndex();
		--this.elementsLeft;
		return val;
	}

	_incrementQueueIndex() {
		if (++this.queueIndex >= this.length) {
			this.queueIndex = 0;
		}
	}

	_incrementDequeIndex() {
		if (++this.dequeIndex >= this.length) {
			this.dequeIndex = 0;
		}
	}
}

console.log("queue.js loaded");