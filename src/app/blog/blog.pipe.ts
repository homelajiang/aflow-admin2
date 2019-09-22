import {Pipe, PipeTransform} from '@angular/core';

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
