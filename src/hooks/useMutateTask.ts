import axios from 'axios';
import { useAppDispatch } from '../app/hooks';
import { resetEditedTask } from '../slices/todoSlice';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { Task, EditTask } from '../types/types';

export const useMutateTask = () => {
  // dispatchの型あり
  const dispatch = useAppDispatch();
  // cacheにアクセスする際に使う
  const queryClient = useQueryClient();

  const createTaskMutation = useMutation(
    (task: Omit<EditTask, 'id'>) =>
      axios.post<{ data: Task }>(`${process.env.REACT_APP_REST_URL}/tasks/`, {
        title: task.title,
        tag: task.tag,
        tag_name: task.tag_name,
      }),
    {
      onSuccess: ({ data: { data } }) => {
        const previousTodos = queryClient.getQueryData<Task[]>(['tasks']);
        if (previousTodos) {
          queryClient.setQueryData<Task[]>(['tasks'], [...previousTodos, data]);
        }
        dispatch(resetEditedTask());
      },
    }
  );
  const updateTaskMutation = useMutation(
    (task: EditTask) =>
      axios.patch<{ data: Task }>(
        `${process.env.REACT_APP_REST_URL}/tasks/${task.id}/`,
        {
          title: task.title,
          tag: task.tag,
          tag_name: task.tag_name,
        }
      ),
    {
      // 第一引数には返り値、第2引数にはuseMutationの第1引数の関数の引数
      onSuccess: ({ data: { data } }, variables) => {
        // cacheの更新
        const previousTodos = queryClient.getQueryData<Task[]>(['tasks']);
        if (previousTodos) {
          queryClient.setQueryData<Task[]>(
            ['tasks'],
            previousTodos.map((task) =>
              task.id === variables.id ? data : task
            )
          );
        }
        dispatch(resetEditedTask());
      },
    }
  );
  const deleteTaskMutation = useMutation(
    (id: number) =>
      axios.delete(`${process.env.REACT_APP_REST_URL}/tasks/${id}/`),
    {
      onSuccess: ({ data: { data } }, variables) => {
        const previousTodos = queryClient.getQueryData<Task[]>(['tasks']);
        if (previousTodos) {
          queryClient.setQueryData<Task[]>(
            ['tasks'],
            previousTodos.filter((task) => task.id !== variables)
          );
        }
        dispatch(resetEditedTask());
      },
    }
  );
  return { deleteTaskMutation, createTaskMutation, updateTaskMutation };
};
