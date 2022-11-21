import axios from 'axios';
import { useAppDispatch } from '../app/hooks';
import { resetEditedTag } from '../slices/todoSlice';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { Tag } from '../types/types';

export const useMutateTag = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  const createTagMutation = useMutation(
    (tag: Omit<Tag, 'id'>) =>
      axios.post<{ data: Tag }>(`${process.env.REACT_APP_REST_URL}/tags/`, {
        name: tag.name,
      }),
    {
      onSuccess: ({ data: { data } }) => {
        const previousTags = queryClient.getQueryData<Tag[]>(['tags']);
        if (previousTags) {
          queryClient.setQueryData<Tag[]>(['tags'], [...previousTags, data]);
        }
        dispatch(resetEditedTag());
      },
    }
  );
  const updateTagMutation = useMutation(
    (tag: Tag) =>
      axios.patch<{ data: Tag }>(
        `${process.env.REACT_APP_REST_URL}/tags/${tag.id}/`,
        { name: tag.name }
      ),
    {
      onSuccess: ({ data: { data } }, variables) => {
        const previousTags = queryClient.getQueryData<Tag[]>(['tags']);
        if (previousTags) {
          queryClient.setQueryData<Tag[]>(
            ['tags'],
            previousTags.map((tag) => (tag.id === variables.id ? data : tag))
          );
        }
        dispatch(resetEditedTag());
      },
    }
  );
  const deleteTagMutation = useMutation(
    (id: number) =>
      axios.delete(`${process.env.REACT_APP_REST_URL}/tags/${id}/`),
    {
      onSuccess: (res, variables) => {
        const previousTags = queryClient.getQueryData<Tag[]>(['tags']);
        if (previousTags) {
          queryClient.setQueryData<Tag[]>(
            ['tags'],
            previousTags.filter((tag) => tag.id !== variables)
          );
        }
        dispatch(resetEditedTag());
      },
    }
  );
  return { deleteTagMutation, createTagMutation, updateTagMutation };
};
