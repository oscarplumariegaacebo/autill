import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { map, Observable, startWith } from 'rxjs';
import { Client } from '../../../core/models/Client';
import { ClientService } from '../../../core/services/client.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-filters',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatAutocompleteModule, AsyncPipe],
  templateUrl: './search-filters.component.html',
  styleUrl: './search-filters.component.css'
})
export class SearchFiltersComponent {
  @Output() updateSearching = new EventEmitter<any>();
  
  searchForm!: FormGroup
  clientService = inject(ClientService);
  clients: any = [];
  filteredClients!: Observable<Client[]>;

  initializeForm() {
    this.searchForm = new FormGroup({
      name: new FormControl(),
      clientId: new FormControl(),
      date: new FormControl(),
      status: new FormControl()
    })
  }

  constructor(){
    this.initializeForm();
  }

  ngOnInit() {
    this.clientService.getClients().subscribe((clients: any) => {
      this.clients = clients;

      this.filteredClients = this.searchForm.controls['clientId'].valueChanges.pipe(
        startWith(''),
        map(value => {
          const item = value;
          return item ? this._filter(item as string) : clients || '';
        }),
      );
    })
  }

  search(){
    this.updateSearching.emit(this.searchForm.value); 
  }

  private _filter(value: any): any[] {
    let filterValue = '';

    return this.clients.filter((option:any) => option.name.toLowerCase().includes(filterValue));
  }
}
