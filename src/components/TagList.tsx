import { FC, memo } from 'react';
import { useQueryTags } from '../hooks/useQueryTags';
import { TagItemMemo } from './TagItem';
// import { useQueryClient } from '@tanstack/react-query'
// import { Tag } from '../types/types'
const TagList: FC = () => {
  const { status, data } = useQueryTags();
  // const queryClient = useQueryClient()
  // const data = queryClient.getQueryData<Tag[]>(['tags'])
  // useQueryはcacheに変更があると、毎回検知して再レンダリングしてくれるが、queryClient.getQueryData<Tag[]>(['tags'])(cacheから直接取り出す）だと、変更を検知して再レンダリングしてくれない
  console.log('rendered TagList');
  if (status === 'loading') return <div>{'Loading...'}</div>;
  if (status === 'error') return <div>{'Error'}</div>;
  return (
    <div>
      {data?.map((tag) => (
        <div key={tag.id}>
          <ul>
            <TagItemMemo tag={tag} />
          </ul>
        </div>
      ))}
    </div>
  );
};
export const TagListMemo = memo(TagList);
