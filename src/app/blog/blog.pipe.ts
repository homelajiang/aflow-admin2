import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';
moment.locale('zh-cn');

@Pipe({name: 'postStatus'})
export class PostStatusPipe implements PipeTransform {
  transform(status: string) {
    switch (status) {
      case 'published':
        return '已发布';
      case 'draft':
        return '草稿';
      case 'deleted':
        return '已删除';
    }
    return '未知的状态';
  }
}

@Pipe({name: 'postOpen'})
export class PostOpenPipe implements PipeTransform {
  transform(open: string) {
    switch (open) {
      case 'public':
        return '公开';
      case 'protect':
        return '密码保护';
      case 'private':
        return '私密';
    }
    return '未知的状态';
  }
}

@Pipe({name: 'relativeDate'})
export class RelativeDatePipe implements PipeTransform {
  transform(timeString: string, ...args: string[]): any {
    if (args && args[0]) {
      return moment(timeString, args[0]).fromNow();
    } else {
      // 2019-11-05 16:28:11
      return moment(timeString, 'YYYY-MM-DD HH:mm:ss').fromNow();
    }
  }
}
