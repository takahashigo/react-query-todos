import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Task } from '../types/types';

export const useQueryTasks = () => {
  const getTasks = async () => {
    const {
      data: { data },
    } = await axios.get<{ data: Task[] }>(
      `${process.env.REACT_APP_REST_URL}/tasks/`
    );
    return data;
  };
  return useQuery<Task[], Error>({
    queryKey: ['tasks'],
    queryFn: getTasks,
    staleTime: 0,
    // windowにfocusがあたったら、fecthしにいく
    refetchOnWindowFocus: true,
    //cacheTime: 5000, //この関数を利用しているcomponentがアンマウントされてから、5秒後にcacheから削除される
    //refetchInterval: 5000, //poolingできる（5秒毎にフェッチしてくれる）
  });
};

// useQuery(get)
