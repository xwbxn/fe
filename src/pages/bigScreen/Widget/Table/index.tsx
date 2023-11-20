import React, { useCallback, useEffect, useRef, useState } from 'react';
import './index.less';

interface ITableProps {
  // 数据，模拟跟真实数据都走这里
  data: any;
  // 字段名
  field: string;
  options: any;
}

const Table = ({ data = {}, field = 'value', options }: ITableProps) => {
  // 是否动画
  const [animate, setAnimate] = useState(false);
  // 定时器
  const timmer = useRef<any>(null);
  const [datas, setDatas] = useState([]);

  const hander = useCallback(() => {
    setAnimate(true);
    clearTimeout(timmer.current);
    timmer.current = setTimeout(() => {
      setDatas((state) => {
        const newList = [...state];
        newList.push(newList[0]);
        newList.push(newList[0]);
        newList.shift();
        newList.shift();
        return newList;
      });
      setAnimate(false);
    }, 400);
  }, []);

  useEffect(() => {
    if (data && data[field] && data[field] instanceof Array) {
      setDatas(data[field]);
    }
  }, [data, field]);

  useEffect(() => {
    let intervalTimmer: any = null;
    if (datas.length > options.tableRows && options.tableRolling) {
      intervalTimmer = setInterval(hander, 4000);
    }
    return () => {
      clearInterval(intervalTimmer);
    };
  }, [options.tableRows, options.tableRolling, datas, hander]);

  const { tableColumn = [] } = options;

  return (
    <>
      {tableColumn.length ? (
        <div
          className='table'
          style={{
            fontSize: options.tableFontSize,
            lineHeight: options.tableLineHeight - 2 + 'px',
          }}
        >
          {options.tableShowHeader ? (
            <div className='table-header'>
              <table
                style={{
                  background: options.tableHeaderBackgroudColor,
                  color: options.tableHeaderColor,
                }}
              >
                <colgroup>
                  {tableColumn.map((item: any, index: number) => (
                    <col width={item.width} key={index} />
                  ))}
                </colgroup>
                <thead>
                  <tr>
                    {tableColumn.map((item: any, index: number) => (
                      <td
                        style={{
                          border: options.tableShowBorder ? `1px solid ${options.tableBorderColor}` : 'none',
                        }}
                        key={index}
                        align={item.align || 'left'}
                      >
                        {item.title}
                      </td>
                    ))}
                  </tr>
                </thead>
              </table>
            </div>
          ) : null}
          <div
            style={{
              height: options.tableLineHeight * options.tableRows + 1,
              transform: `translateY(${animate ? -options.tableLineHeight * 2 + 'px' : 0})`,
              transition: `all ${animate ? 0.5 : 0}s`,
              marginTop: -1,
            }}
            className='table-body'
          >
            <table
              style={{
                color: options.tableTbodyColor,
              }}
            >
              <colgroup>
                {tableColumn.map((item: any, index: number) => (
                  <col width={item.width} key={index} />
                ))}
              </colgroup>
              <tbody>
                {datas.map((item: any, index: number) => (
                  <tr
                    style={{
                      background: index % 2 === 0 ? options.tableTbodyEvenBackgroudColor : options.tableTbodyOddBackgroudColor,
                    }}
                    key={index}
                  >
                    {tableColumn.map((subItem: any, subIndex: number) => (
                      <td
                        style={{
                          height: options.tableLineHeight,
                          border: options.tableShowBorder ? `1px solid ${options.tableBorderColor}` : 'none',
                        }}
                        key={subIndex}
                        align={subItem.align || 'left'}
                      >
                        {typeof subItem.render === 'function' ? subItem.render(item) : item[subItem.dataIndex] || '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Table;
