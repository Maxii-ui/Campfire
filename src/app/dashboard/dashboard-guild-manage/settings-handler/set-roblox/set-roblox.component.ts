import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DashboardGuildManageComponent } from '../../dashboard-guild-manage.component';
import Swal from 'sweetalert2';

interface VerifyData {
  enabled: boolean;
  groupId: number;
  verifiedRole: string;
  bindsOn: boolean;
  binds: object;
}

interface Callback {
  completed: boolean;
}

@Component({
  selector: 'app-set-roblox',
  templateUrl: './set-roblox.component.html',
  styleUrls: ['./set-roblox.component.css']
})
export class SetRobloxComponent implements OnInit {
  loaded = false;
  enabled = false;
  status = 'Disabled';
  role: string;
  groupId: number;
  binds: object;

  constructor(
    private http: HttpClient,
    private guildMan: DashboardGuildManageComponent
  ) {}

  ngOnInit() {
    this.http
      .get<VerifyData>(
        `https://api.campfirebot.xyz/settings/${this.guildMan.getServerId()}/verify`,
        {
          headers: {
            Authorization: localStorage.getItem('auth')
          }
        }
      )
      .subscribe(data => {
        this.loaded = true;
        if (data.enabled) {
          this.enabled = true;
          this.status = 'Enabled';
          this.groupId = data.groupId;
          this.role = data.verifiedRole;
          this.binds = data.binds;
        } else {
          this.enabled = false;
          this.status = 'Disabled';
        }
      });
  }

  toggleVerify() {
    if (this.enabled === false) {
      this.http
        .post<Callback>(
          `https://api.campfirebot.xyz/settings/${this.guildMan.getServerId()}/verify/toggle`,
          {
            toggle: true
          },
          {
            headers: {
              Authorization: localStorage.getItem('auth')
            }
          }
        )
        .subscribe(data => {
          if (data.completed === true) {
            this.enabled = true;
            this.status = 'Enabled';
          }
        });
    } else {
      this.http
        .post<Callback>(
          `https://api.campfirebot.xyz/settings/${this.guildMan.getServerId()}/verify/toggle`,
          {
            toggle: false
          },
          {
            headers: {
              Authorization: localStorage.getItem('auth')
            }
          }
        )
        .subscribe(data => {
          if (data.completed === true) {
            this.enabled = false;
            this.status = 'Disabled';
          }
        });
    }
  }

  setRoblox(formInputData) {
    Swal.fire({
      title: 'Just a moment',
      position: 'bottom-end',
      // tslint:disable-next-line: quotemark
      text: "We're saving your data",
      type: 'info',
      toast: true,
      showConfirmButton: false,
      timer: 2000
    });
    this.http
      .post<Callback>(
        `https://api.campfirebot.xyz/settings/${this.guildMan.getServerId()}/verify`,
        {
          role: formInputData.value.role,
          group: formInputData.value.groupId
        },
        {
          headers: {
            Authorization: localStorage.getItem('auth')
          }
        }
      )
      .subscribe(data => {
        if (data.completed) {
          document.getElementById('saveButton').classList.add('is-success');
          Swal.fire({
            title: 'All done!',
            position: 'bottom-end',
            // tslint:disable-next-line: quotemark
            text: 'Your data was saved',
            type: 'success',
            toast: true,
            showConfirmButton: false,
            timer: 2000
          });
          setTimeout(() => {
            document
              .getElementById('saveButton')
              .classList.remove('is-success');
          }, 2000);
        }
      });
  }
}
