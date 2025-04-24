"use client"
 
import { useState, forwardRef, useImperativeHandle, ForwardedRef } from 'react';
import RichTextEditor, { BaseKit, Bold, BulletList, Clear, Color} from 'reactjs-tiptap-editor';
import { FontSize } from 'reactjs-tiptap-editor'; 
import { FormatPainter } from 'reactjs-tiptap-editor'; 
import { Heading } from 'reactjs-tiptap-editor'; 
import { Highlight } from 'reactjs-tiptap-editor'; 
import { History } from 'reactjs-tiptap-editor'; 
import { HorizontalRule } from 'reactjs-tiptap-editor'; 
import { Image } from 'reactjs-tiptap-editor';
import { Italic } from 'reactjs-tiptap-editor'; 
import { LineHeight } from 'reactjs-tiptap-editor'; 
import { Link } from 'reactjs-tiptap-editor'; 
import { MoreMark } from 'reactjs-tiptap-editor'; 
import { ColumnActionButton } from 'reactjs-tiptap-editor';    
import { OrderedList } from 'reactjs-tiptap-editor'; 
import { SlashCommand } from 'reactjs-tiptap-editor'; 
import { Table } from 'reactjs-tiptap-editor'; 
import { TextAlign } from 'reactjs-tiptap-editor'; 
// Import the locale object
import { locale } from 'reactjs-tiptap-editor';
// Set the language to English
locale.setLang('zh_CN');
// End
// Import CSS
import 'reactjs-tiptap-editor/style.css';

const extensions = [
  BaseKit.configure({
    // Show placeholder
    placeholder: {  
      showOnlyCurrent: true, 
    },  

    // Character count
    characterCount: {  
      limit: 50_000,  
    },  
  }),

  // Import Extensions Here
  History,
  Bold,
  Italic,
  BulletList,
  Clear,
  Color,
  FontSize,
  Heading,
  Highlight,
  HorizontalRule,
  Image.configure({
    upload: (files: File) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(URL.createObjectURL(files))
        }, 500)
      })
    },
  }),
  LineHeight,
  Link,
  MoreMark,
  ColumnActionButton,  
  OrderedList,
  SlashCommand,
  Table,
  TextAlign,

];

// 添加组件的 Props 类型定义
interface ReactTextEditorProps {
  onChange: (content: any) => void;
  value: string;
}

// 添加暴露给父组件的 ref 类型定义
export interface ReactTextEditorRef {
  getContent: () => string;
  setContent: (newValue: string) => void;
  resetContent: () => void;
}

const DEFAULT = '';
const dark = false;
// 修改组件定义，添加类型信息
export const ReactTextEditor = forwardRef<ReactTextEditorRef, ReactTextEditorProps>(
  ({ onChange, value }, ref) => {
    const [content, setContent] = useState(value || DEFAULT);

    const onChangeContent = (newValue: any) => {
      setContent(newValue);
      if (onChange) {
        onChange(newValue);
      }
    };

    // 向父组件暴露方法
    useImperativeHandle(ref, () => ({
      getContent: () => content,
      setContent: (newValue) => {
        setContent(newValue);
        if (onChange) {
          onChange(newValue);
        }
      },
      resetContent: () => {
        setContent(DEFAULT);
        if (onChange) {
          onChange(DEFAULT);
        }
      }
    }));

    return (
      <>
        <RichTextEditor
          output='html'
          content={content}
          onChangeContent={onChangeContent}
          extensions={extensions}
          dark={dark}
        />
      </>
    );
  }
);

// 设置显示名称
ReactTextEditor.displayName = 'ReactTextEditor';