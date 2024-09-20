import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
type ChatMessageProps = {
  message: string;
  accentColor: string;
  name: string;
  isSelf: boolean;
  hideName?: boolean;
};

// const ContentRenderer = ({ content }: { content: string }) => {  
//   const [buffer, setBuffer] = useState(''); // 用于存储未处理的内容  
//   const [parts, setParts] = useState<string[]>([]); // 存储解析后的内容  
//   const [inCodeBlock, setInCodeBlock] = useState<boolean>(false); // 是否在代码块中  
//   const [currentCodeType, setCurrentCodeType] = useState<string>(''); // 当前代码类型  
  
//   useEffect(() => {  
//     const newContent = buffer + content;  
//     const splitParts = newContent.split('```');  
//     const newParts: string[] = [];  
//     debugger
//     // 处理完整的部分  
//     for (let i = 0; i < splitParts.length; i++) {  
//       if (i % 2 === 0) {  
//         // 普通文本部分  
//         newParts.push(splitParts[i]); // 直接添加文本部分  
//       } else {  
//         // 代码部分  
//         const codeType = splitParts[i].trim().split('\n')[0]; // 获取代码类型  
//         const codeContent = splitParts[i].trim().split('\n').slice(1).join('\n'); // 获取代码内容  
  
//         if (!inCodeBlock) {  
//           // 如果不在代码块中，开始新的代码块  
//           setCurrentCodeType(codeType);  
//           newParts.push(codeContent); // 添加代码内容  
//           setInCodeBlock(true);  
//         } else {  
//           // 如果在代码块中，结束当前代码块  
//           newParts.push(codeContent); // 添加代码内容  
//           setInCodeBlock(false);  
//         }  
//       }  
//     }  
  
//     // 更新 buffer 和 parts  
//     setBuffer(splitParts[splitParts.length - 1]);  
//     setParts(newParts);  
//   }, [content]); // 仅依赖 content  
  
//   return (  
//     <div>  
//       {parts.map((part, index) => {  
//         if (currentCodeType === 'markdown') {  
//           return <ReactMarkdown key={index}>{part}</ReactMarkdown>;  
//         } else if (currentCodeType === 'html') {  
//           return <div key={index} dangerouslySetInnerHTML={{ __html: part }} />;  
//         } else {  
//           return <div key={index}>{part}</div>; // 普通文本部分  
//         }  
//       })}  
//     </div>  
//   );  
// };  


export const ChatMessage = ({
  name,
  message,
  accentColor,
  isSelf,
  hideName,
}: ChatMessageProps) => {
   
  return (
    <div className={`flex flex-col gap-1 ${hideName ? 'pt-0' : 'pt-6'}`}>
      {!hideName && (
        <div
          className={`text-${
            isSelf ? 'gray-700' : accentColor + '-800 text-ts-' + accentColor
          } uppercase text-xs`}
        >
          {name}
        </div>
      )}
      <div
        className={`pr-4 text-${
          isSelf ? 'gray-300' : accentColor + '-500'
        } text-sm ${
          isSelf ? '' : 'drop-shadow-' + accentColor
        } whitespace-pre-line`}
      >
        {/* {message.includes('```html') ? (
          <div dangerouslySetInnerHTML={{ __html: message.replace(/```html|```/g, '') }} />
        ) : message.includes('```markdown') ? (
          <ReactMarkdown>{message.replace(/```markdown|```/g, '')}</ReactMarkdown>
        ) : (
          <div>{message}</div>
        )} */}
          {/* <ReactMarkdown>{message}</ReactMarkdown> */}
          {/* <ContentRenderer content={message} />   */}
         {/* {message} */}
        <div dangerouslySetInnerHTML={{ __html: message.replace(/```html <!/g, '').replace(/DOCTYPE html> /g, '').replace(/```/g, '') }} />  

      </div>
    </div>
  );
};