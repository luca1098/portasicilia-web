'use client'

import * as React from 'react'
import { type FieldValues, type Path } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { ScrollArea } from '@/components/ui/scroll-area'
import { InputWrapper } from '@/components/form/input-wrapper'
import { FormField } from './form-field'
import { CheckIcon, ChevronsUpDownIcon, LoaderIcon } from '@/lib/constants/icons'
import { cn } from '@/lib/utils/shadcn.utils'

interface ComboboxFormFieldProps<TFieldValues extends FieldValues, TOption> {
  name: Path<TFieldValues>
  label: string
  description?: string
  options?: TOption[]
  onSearch?: (query: string) => Promise<TOption[]>
  defaultOption?: TOption
  getValue: (option: TOption) => string
  getLabel: (option: TOption) => string
  getKey?: (option: TOption) => string
  renderOption?: (option: TOption) => React.ReactNode
  placeholder?: string
  emptyMessage?: string
  className?: string
  disabled?: boolean
  required?: boolean
}

function ComboboxFormField<TFieldValues extends FieldValues, TOption>({
  name,
  label,
  description,
  options: staticOptions,
  onSearch,
  defaultOption,
  getValue,
  getLabel,
  getKey,
  renderOption,
  placeholder,
  emptyMessage = 'No results found.',
  className,
  disabled,
  required,
}: ComboboxFormFieldProps<TFieldValues, TOption>) {
  const scrollAreaRef = React.useRef<HTMLDivElement>(null)
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const [searchResults, setSearchResults] = React.useState<TOption[]>([])
  const [isSearching, setIsSearching] = React.useState(false)
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const latestSearchRef = React.useRef(0)

  const options = onSearch ? searchResults : (staticOptions ?? [])

  const performSearch = React.useCallback(
    async (query: string) => {
      if (!onSearch) return
      const searchId = ++latestSearchRef.current
      setIsSearching(true)
      try {
        const results = await onSearch(query)
        if (searchId === latestSearchRef.current) setSearchResults(results)
      } finally {
        if (searchId === latestSearchRef.current) setIsSearching(false)
      }
    },
    [onSearch]
  )

  React.useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  return (
    <FormField
      name={name}
      renderField={({ field, fieldState: { error } }) => {
        const selectedOption =
          options.find(o => getValue(o) === field.value) ??
          (defaultOption && getValue(defaultOption) === field.value ? defaultOption : undefined)

        return (
          <InputWrapper
            label={label}
            htmlFor={name}
            description={description}
            error={error}
            className={className}
            hasValue={!!field.value}
            required={required}
          >
            <Popover
              open={open}
              modal
              onOpenChange={o => {
                setOpen(o)
                if (o) {
                  setSearch('')
                  if (onSearch) performSearch('')
                }
              }}
            >
              <PopoverTrigger asChild>
                <Button
                  id={name}
                  type="button"
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  aria-invalid={!!error}
                  disabled={disabled}
                  className={cn(
                    'h-14 w-full justify-between rounded-xl border-input px-3 pt-5 pb-2 font-normal',
                    'shadow-xs hover:bg-transparent',
                    !field.value && 'text-muted-foreground'
                  )}
                >
                  <span className="flex items-center gap-2 truncate">
                    {selectedOption ? (
                      <>
                        {renderOption?.(selectedOption)}
                        {getLabel(selectedOption)}
                      </>
                    ) : (
                      ''
                    )}
                  </span>
                  <ChevronsUpDownIcon className="size-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                  <CommandInput
                    value={search}
                    onValueChange={value => {
                      setSearch(value)
                      if (onSearch) {
                        if (debounceRef.current) clearTimeout(debounceRef.current)
                        debounceRef.current = setTimeout(() => performSearch(value), 300)
                      }
                      setTimeout(() => {
                        if (scrollAreaRef.current) {
                          const viewport = scrollAreaRef.current.querySelector(
                            '[data-radix-scroll-area-viewport]'
                          )
                          if (viewport) viewport.scrollTop = 0
                        }
                      }, 0)
                    }}
                    placeholder={placeholder}
                  />
                  <CommandList>
                    <ScrollArea ref={scrollAreaRef} className="h-72">
                      <CommandEmpty>
                        {isSearching ? (
                          <LoaderIcon className="mx-auto size-4 animate-spin text-muted-foreground" />
                        ) : (
                          emptyMessage
                        )}
                      </CommandEmpty>
                      <CommandGroup>
                        {options.map(option => {
                          const value = getValue(option)
                          const optionLabel = getLabel(option)
                          const isSelected = value === field.value

                          return (
                            <CommandItem
                              key={getKey ? getKey(option) : value}
                              value={optionLabel}
                              onSelect={() => {
                                field.onChange(value)
                                setOpen(false)
                              }}
                              className="gap-2"
                            >
                              {renderOption?.(option)}
                              <span className="flex-1 truncate">{optionLabel}</span>
                              <CheckIcon
                                className={cn('ml-auto size-4', isSelected ? 'opacity-100' : 'opacity-0')}
                              />
                            </CommandItem>
                          )
                        })}
                      </CommandGroup>
                    </ScrollArea>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </InputWrapper>
        )
      }}
    />
  )
}

export { ComboboxFormField, type ComboboxFormFieldProps }
