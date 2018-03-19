import {Injectable, Output, EventEmitter} from '@angular/core';

@Injectable()
export class AckService {

  @Output() updateURLList: EventEmitter<string> = new EventEmitter();

  @Output() eraseURLList: EventEmitter<any> = new EventEmitter();


  updateList(token) {
    this.updateURLList.emit(token);
  }

  eraseList() {
    this.eraseURLList.emit(null);
  }

}
