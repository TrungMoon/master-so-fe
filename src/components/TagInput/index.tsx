import React, { useState, useEffect, useRef } from 'react';
import { Tag, Input, Tooltip, AutoComplete, InputRef } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import searchService from '../../services/searchService';
import './TagInput.less';

interface TagInputProps {
  value?: string[];
  onChange?: (tags: string[]) => void;
  maxTags?: number;
}

const TagInput: React.FC<TagInputProps> = ({ 
  value = [], 
  onChange, 
  maxTags = 10 
}) => {
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<InputRef>(null);
  const editInputRef = useRef<InputRef>(null);

  // Focus input when becoming visible
  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  // Focus edit input when editing a tag
  useEffect(() => {
    if (editInputIndex !== -1) {
      editInputRef.current?.focus();
    }
  }, [editInputIndex]);

  // Get tag suggestions when input changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (inputValue.trim()) {
        try {
          const tags = await searchService.getTagSuggestions(inputValue);
          setSuggestions(tags.filter(tag => !value.includes(tag)));
        } catch (error) {
          console.error('Error fetching tag suggestions:', error);
        }
      } else {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [inputValue, value]);

  // Handle tag removal
  const handleClose = (removedTag: string) => {
    const newTags = value.filter(tag => tag !== removedTag);
    if (onChange) {
      onChange(newTags);
    }
  };

  // Show input for new tag
  const showInput = () => {
    setInputVisible(true);
  };

  // Add new tag when input is confirmed
  const handleInputConfirm = () => {
    if (inputValue && !value.includes(inputValue) && value.length < maxTags) {
      const newTags = [...value, inputValue];
      if (onChange) {
        onChange(newTags);
      }
    }
    setInputVisible(false);
    setInputValue('');
  };

  // Start editing a tag
  const handleEdit = (index: number) => {
    setEditInputIndex(index);
    setEditInputValue(value[index]);
  };

  // Save edited tag
  const handleEditInputConfirm = () => {
    const newTags = [...value];
    newTags[editInputIndex] = editInputValue;
    if (onChange) {
      onChange(newTags);
    }
    setEditInputIndex(-1);
    setEditInputValue('');
  };

  // Handle tag selection from autocomplete
  const handleSelect = (selectedValue: string) => {
    if (!value.includes(selectedValue) && value.length < maxTags) {
      const newTags = [...value, selectedValue];
      if (onChange) {
        onChange(newTags);
      }
    }
    setInputVisible(false);
    setInputValue('');
  };

  return (
    <div className="tag-input">
      {/* Display existing tags */}
      {value.map((tag, index) => {
        if (editInputIndex === index) {
          // Edit mode for a tag
          return (
            <Input
              ref={editInputRef}
              key={tag}
              size="small"
              className="tag-input-edit"
              value={editInputValue}
              onChange={e => setEditInputValue(e.target.value)}
              onBlur={handleEditInputConfirm}
              onPressEnter={handleEditInputConfirm}
            />
          );
        }
        // Display tag with edit ability
        const isLongTag = tag.length > 20;
        const tagElem = (
          <Tag
            className="tag-item"
            key={tag}
            closable
            onClose={() => handleClose(tag)}
            onClick={() => handleEdit(index)}
          >
            {isLongTag ? `${tag.slice(0, 20)}...` : tag}
          </Tag>
        );
        return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
      })}

      {/* Input for new tag */}
      {inputVisible ? (
        <AutoComplete
          value={inputValue}
          options={suggestions.map(tag => ({ value: tag }))}
          onSelect={handleSelect}
          style={{ width: 120 }}
        >
          <Input
            ref={inputRef}
            type="text"
            size="small"
            className="tag-input-new"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onBlur={handleInputConfirm}
            onPressEnter={handleInputConfirm}
          />
        </AutoComplete>
      ) : (
        // Show button to add new tag if under limit
        value.length < maxTags && (
          <Tag className="tag-plus" onClick={showInput}>
            <PlusOutlined /> Thêm tag
          </Tag>
        )
      )}
      
      {/* Show max tag limit */}
      {value.length >= maxTags && (
        <span className="tag-limit-message">
          Đã đạt giới hạn {maxTags} tags
        </span>
      )}
    </div>
  );
};

export default TagInput; 