import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { ajax } from 'rxjs/ajax';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'http-tester';

  constructor(private http: HttpClient) {}

  async ngOnInit() {
    await this.getToken();
  }

  async getToken() {
    const header = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Authorization', 'Basic ' + btoa('oauth:oauth')),
    };

    const params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', 'rex');
    params.set('password', '1');
    params.set('scope', 'all');

    this.http
      .post('/auth/oauth/token', params.toString(), header)
      .pipe(map((data) => data))
      .subscribe((data) => localStorage.setItem('token', JSON.stringify(data)));
  }

  send() {
    let token = JSON.parse(localStorage.getItem('token')!);

    const params = new URLSearchParams();
    params.set('token', token.access_token);

    let checked = false;

    ajax({
      url: '/auth/oauth/check_token',
      async: false,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + btoa('oauth:oauth'),
      },
      body: params.toString(),
    }).subscribe((data) => {
      console.info(data);
      checked = true;
    });

    console.info(checked);
  }
}
