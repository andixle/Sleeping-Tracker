import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSegment, IonSegmentButton, IonLabel, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, IonItem, IonList, IonBadge, IonRefresher, IonRefresherContent, IonButton, IonButtons, IonBackButton, IonAlert, IonItemSliding, IonItemOptions } from '@ionic/angular/standalone';
import { SleepService } from '../services/sleep.service';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { moonOutline, sunnyOutline, statsChartOutline, timeOutline, trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-view-data',
  templateUrl: './view-data.page.html',
  styleUrls: ['./view-data.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonSegment, IonSegmentButton, IonLabel, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, IonItem, IonList, IonBadge, IonRefresher, IonRefresherContent, IonButton, IonButtons, IonBackButton, IonAlert, IonItemSliding, IonItemOptions, CommonModule, FormsModule]
})
export class ViewDataPage implements OnInit {
  selectedFilter: string = 'all';
  selectedSort: string = 'newest';
  moonOutline = moonOutline;
  sunnyOutline = sunnyOutline;
  statsChartOutline = statsChartOutline;
  timeOutline = timeOutline;
  trashOutline = trashOutline;
  showDeleteAlert: boolean = false;
  itemToDelete: SleepData | null = null;
  showAlert: boolean = false;
  alertMessage: string = '';

  constructor(private sleepService: SleepService) { }

  ngOnInit() {
    // Data will be loaded through getters
  }

  /* Getters for sleep data */
  get allSleepData() {
    return SleepService.AllSleepData;
  }

  get overnightSleepData() {
    return SleepService.AllOvernightData;
  }

  get sleepinessData() {
    return SleepService.AllSleepinessData;
  }

  /* Filter and sort logic */
  get filteredAndSortedData() {
    let data = [...this.allSleepData];

    // Apply filter
    switch (this.selectedFilter) {
      case 'overnight':
        data = data.filter(item => item instanceof OvernightSleepData);
        break;
      case 'sleepiness':
        data = data.filter(item => item instanceof StanfordSleepinessData);
        break;
      case 'all':
      default:
        // Keep all data
        break;
    }

    // Apply sorting
    switch (this.selectedSort) {
      case 'newest':
        data.sort((a, b) => b.loggedAt.getTime() - a.loggedAt.getTime());
        break;
      case 'oldest':
        data.sort((a, b) => a.loggedAt.getTime() - b.loggedAt.getTime());
        break;
    }

    return data;
  }

  /* Data statistics */
  get statistics() {
    const total = this.allSleepData.length;
    const overnight = this.overnightSleepData.length;
    const sleepiness = this.sleepinessData.length;
    
    return {
      total,
      overnight,
      sleepiness,
      averageSleepDuration: this.calculateAverageSleepDuration(),
      averageSleepinessLevel: this.calculateAverageSleepinessLevel()
    };
  }

  private calculateAverageSleepDuration(): string {
    if (this.overnightSleepData.length === 0) return '0h 0m';
    
    const totalMinutes = this.overnightSleepData.reduce((sum, data) => {
      const duration = data.summaryString();
      const hours = parseInt(duration.split(' ')[0]);
      const minutes = parseInt(duration.split(' ')[2]);
      return sum + (hours * 60 + minutes);
    }, 0);
    
    const avgHours = Math.floor(totalMinutes / this.overnightSleepData.length / 60);
    const avgMinutes = Math.floor(totalMinutes / this.overnightSleepData.length % 60);
    return `${avgHours}h ${avgMinutes}m`;
  }

  private calculateAverageSleepinessLevel(): number {
    if (this.sleepinessData.length === 0) return 0;
    
    const total = this.sleepinessData.reduce((sum, data) => {
      // Access the private loggedValue through the summaryString
      const summary = data.summaryString();
      const level = parseInt(summary.split(':')[0]);
      return sum + level;
    }, 0);
    
    return Math.round(total / this.sleepinessData.length * 10) / 10;
  }

  /* Helper methods */
  getIconForData(data: SleepData): string {
    if (data instanceof OvernightSleepData) {
      return moonOutline;
    } else if (data instanceof StanfordSleepinessData) {
      return sunnyOutline;
    }
    return statsChartOutline;
  }

  getTypeForData(data: SleepData): string {
    if (data instanceof OvernightSleepData) {
      return 'Overnight Sleep';
    } else if (data instanceof StanfordSleepinessData) {
      return 'Sleepiness Level';
    }
    return 'Unknown';
  }

  getBadgeColor(data: SleepData): string {
    if (data instanceof OvernightSleepData) {
      return 'primary';
    } else if (data instanceof StanfordSleepinessData) {
      const summary = data.summaryString();
      const level = parseInt(summary.split(':')[0]);
      if (level <= 2) return 'success';
      if (level <= 4) return 'warning';
      return 'danger';
    }
    return 'medium';
  }

  getBadgeText(data: SleepData): string {
    if (data instanceof OvernightSleepData) {
      return 'Sleep';
    } else if (data instanceof StanfordSleepinessData) {
      const summary = data.summaryString();
      return `Level ${summary.split(':')[0]}`;
    }
    return 'Unknown';
  }

  /* Refresh functionality */
  handleRefresh(event: any) {
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  /* Filter and sort handlers */
  onFilterChange(event: any) {
    this.selectedFilter = event.detail.value;
  }

  onSortChange(event: any) {
    this.selectedSort = event.detail.value;
  }

  /* Delete functionality */
  async confirmDelete(data: SleepData) {
    this.itemToDelete = data;
    this.showDeleteAlert = true;
  }

  async deleteItem() {
    console.log('deleteItem called, itemToDelete:', this.itemToDelete);
    if (this.itemToDelete) {
      console.log('Deleting item with ID:', this.itemToDelete.id);
      this.sleepService.deleteSleepData(this.itemToDelete.id);
      this.showDeleteAlert = false;
      this.itemToDelete = null;
      console.log('Delete completed');
    } else {
      console.log('No item to delete');
    }
  }

  cancelDelete() {
    this.itemToDelete = null;
    this.showDeleteAlert = false;
  }

  async handleDeleteAlert(event: any) {
    console.log('Alert dismissed with event:', event);
    console.log('Event detail:', event.detail);
    console.log('Event data:', event.detail.data);
    
    // Check if user clicked Delete button (index 1)
    if (event.detail.data && event.detail.data.values) {
      console.log('Button clicked:', event.detail.data.values);
    }
    
    // The role should be 'destructive' for delete button
    if (event.detail.role === 'destructive') {
      console.log('User clicked Delete');
      await this.deleteItem();
    } else {
      console.log('User clicked Cancel or dismissed alert');
      this.cancelDelete();
    }
  }

  dismissAlert() {
    this.showAlert = false;
  }
}
