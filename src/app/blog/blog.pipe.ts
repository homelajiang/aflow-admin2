import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'postStatus' })
export class PostStatusPipe implements PipeTransform {
    transform(status: number) {
        switch (status) {
            case 1:
                return '已发布';
            case 0:
                return '草稿';
            case -1:
                return '已删除';
        }
        return '未知的状态';
    }
}

@Pipe({ name: 'postOpen' })
export class PostOpenPipe implements PipeTransform {
    transform(open: number) {
        switch (open) {
            case 0:
                return '公开';
            case 1:
                return '密码保护';
            case 2:
                return '私密';
        }
        return '未知的状态';
    }
}