import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-filter-box',
  templateUrl: './filter-box.component.html',
  styleUrls: ['./filter-box.component.scss']
})
export class FilterBoxComponent {
constructor(public dialogRef: MatDialogRef<FilterBoxComponent>) {}

  close(): void {
    this.dialogRef.close();
}
}
