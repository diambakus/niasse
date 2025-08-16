import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


export enum DataKey {
  activeOrgan = 'activeOrgan',
  activeUnit  = 'activeUnit'
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private subjects: Map<string, BehaviorSubject<any>> = new Map();

  constructor() {
    const keys: string[] = Object.keys(DataKey).map(key => key as string);
    keys.forEach(key => {
      const storedData = localStorage.getItem(key);
      if (storedData) {
        this.subjects.set(key, new BehaviorSubject<any>(JSON.parse(storedData)));
      }
    });
  }

  getData(key: string) {
    if (!this.subjects.has(key)) {
      this.subjects.set(key, new BehaviorSubject<any>(null));
    }
    return this.subjects.get(key)?.asObservable();
  }

  setData(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
    if (!this.subjects.has(key)) {
      this.subjects.set(key, new BehaviorSubject<any>(data));
    } else {
      this.subjects.get(key)?.next(data);
    }
  }

  removeData(key: string) {
    localStorage.removeItem(key);
    this.subjects.delete(key);
  }

  clearAllData() {
    localStorage.clear();
    this.subjects.clear();
  }
}
