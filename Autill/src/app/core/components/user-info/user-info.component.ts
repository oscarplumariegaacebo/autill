import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { User } from '../../models/User';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css'
})
export class UserInfoComponent {

  constructor (private service: ApiService) {}
  ngOnInit() {
    this.service.getUserByEmail('e9daef70-e10d-4315-82d1-342a69cdcd6f').subscribe((data: any) => {
      console.log(data);
    })
  }

}
