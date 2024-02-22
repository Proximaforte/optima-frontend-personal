import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'native-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent {
  @Input() element!: number;
  @Input() start!: number;
  @Input() end!: number;
  @Input() id!: string;
  @Input() total!: number;
  @Output() changePage = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  paged(event: any) {
    this.changePage.emit(event);
  }
}
