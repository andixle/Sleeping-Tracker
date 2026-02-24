import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogSleepPage } from './log-sleep.page';

describe('LogSleepPage', () => {
  let component: LogSleepPage;
  let fixture: ComponentFixture<LogSleepPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LogSleepPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
