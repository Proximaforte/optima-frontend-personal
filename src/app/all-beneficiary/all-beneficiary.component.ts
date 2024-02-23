import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FilterBoxComponent } from '../utilities/filter-box/filter-box.component';
@Component({
  selector: 'app-all-beneficiary',
  templateUrl: './all-beneficiary.component.html',
  styleUrls: ['./all-beneficiary.component.scss'],
})
export class AllBeneficiaryComponent {
  // public page = 0;
  // public pageSize = 15;
  // public paginator: any;
  // public start!: number;
  // public end!: number;
  // public total: number = 0;
  // public element!: number;
  lastpage!: number;
  currentPage: number = 1;
  constructor(public dialog: MatDialog) {}

  openModal(): void {
    const dialogRef = this.dialog.open(FilterBoxComponent, {
      width: '30%',
      height: '100%',
      panelClass: 'custom-dialog-container',

      position: { right: '0' },
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }

  // public pageChanged(pageInfo: number) {
  //   this.page = pageInfo - 1;
  //   this.paginator.currentPage = pageInfo;
  //   // this.loadData();
  // }
}
