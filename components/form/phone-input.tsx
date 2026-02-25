'use client'

import * as React from 'react'
import * as RPNInput from 'react-phone-number-input'
import flags from 'react-phone-number-input/flags'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { CheckIcon, ChevronsUpDownIcon } from '@/lib/constants/icons'
import { cn } from '@/lib/utils/shadcn.utils'

type PhoneInputProps = Omit<React.ComponentProps<'input'>, 'onChange' | 'value' | 'ref'> &
  Omit<RPNInput.Props<typeof RPNInput.default>, 'onChange'> & {
    onChange?: (value: RPNInput.Value) => void
    label?: string
    required?: boolean
  }

const PhoneInput: React.ForwardRefExoticComponent<PhoneInputProps> = React.forwardRef<
  React.ElementRef<typeof RPNInput.default>,
  PhoneInputProps
>(({ className, onChange, value, label, required, ...props }, ref) => {
  return (
    <RPNInput.default
      ref={ref}
      className={cn('flex w-full [&>*:last-child]:flex-1', className)}
      flagComponent={FlagComponent}
      countrySelectComponent={CountrySelect}
      inputComponent={React.useMemo(
        () =>
          React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(function PhoneInputInner(
            { className: inputClassName, ...inputProps },
            inputRef
          ) {
            const hasValue = !!(inputProps.value && String(inputProps.value).length > 0)

            return (
              <div className="group/field relative flex-1" data-has-value={hasValue ? '' : undefined}>
                <Input
                  className={cn('rounded-l-none rounded-r-xl border-l-0', inputClassName)}
                  {...inputProps}
                  ref={inputRef}
                />
                {label && (
                  <label
                    htmlFor={inputProps.id}
                    className={cn(
                      'pointer-events-none absolute left-3 select-none transition-all duration-200',
                      'font-normal text-muted-foreground',
                      'top-4 text-sm',
                      'group-focus-within/field:top-1.5 group-focus-within/field:text-xs',
                      'group-data-has-value/field:top-1.5 group-data-has-value/field:text-xs'
                    )}
                  >
                    {label}
                    {required && <span className="ml-0.5 text-destructive">*</span>}
                  </label>
                )}
              </div>
            )
          }),
        [label, required]
      )}
      smartCaret={false}
      value={value || undefined}
      onChange={value => onChange?.(value || ('' as RPNInput.Value))}
      {...props}
    />
  )
})
PhoneInput.displayName = 'PhoneInput'

type CountryEntry = { label: string; value: RPNInput.Country | undefined }

type CountrySelectProps = {
  disabled?: boolean
  value: RPNInput.Country
  options: CountryEntry[]
  onChange: (country: RPNInput.Country) => void
}

const CountrySelect = ({
  disabled,
  value: selectedCountry,
  options: countryList,
  onChange,
}: CountrySelectProps) => {
  const scrollAreaRef = React.useRef<HTMLDivElement>(null)
  const [searchValue, setSearchValue] = React.useState('')
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Popover
      open={isOpen}
      modal
      onOpenChange={open => {
        setIsOpen(open)
        if (open) setSearchValue('')
      }}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            'flex h-14 gap-1 rounded-l-xl rounded-r-none border-r-0 px-3',
            'shadow-xs focus:z-10'
          )}
          disabled={disabled}
        >
          <FlagComponent country={selectedCountry} countryName={selectedCountry} />
          <ChevronsUpDownIcon
            className={cn('-mr-2 size-4 opacity-50', disabled ? 'hidden' : 'opacity-100')}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput
            value={searchValue}
            onValueChange={value => {
              setSearchValue(value)
              setTimeout(() => {
                if (scrollAreaRef.current) {
                  const viewportElement = scrollAreaRef.current.querySelector(
                    '[data-radix-scroll-area-viewport]'
                  )
                  if (viewportElement) {
                    viewportElement.scrollTop = 0
                  }
                }
              }, 0)
            }}
            placeholder="Search country..."
          />
          <CommandList>
            <ScrollArea ref={scrollAreaRef} className="h-72">
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {countryList.map(({ value, label }) =>
                  value ? (
                    <CountrySelectOption
                      key={value}
                      country={value}
                      countryName={label}
                      selectedCountry={selectedCountry}
                      onChange={onChange}
                      onSelectComplete={() => setIsOpen(false)}
                    />
                  ) : null
                )}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

interface CountrySelectOptionProps extends RPNInput.FlagProps {
  selectedCountry: RPNInput.Country
  onChange: (country: RPNInput.Country) => void
  onSelectComplete: () => void
}

const CountrySelectOption = ({
  country,
  countryName,
  selectedCountry,
  onChange,
  onSelectComplete,
}: CountrySelectOptionProps) => {
  const handleSelect = () => {
    onChange(country)
    onSelectComplete()
  }

  return (
    <CommandItem className="gap-2" onSelect={handleSelect}>
      <FlagComponent country={country} countryName={countryName} />
      <span className="flex-1 text-sm">{countryName}</span>
      <span className="text-sm text-foreground/50">{`+${RPNInput.getCountryCallingCode(country)}`}</span>
      <CheckIcon
        className={cn('ml-auto size-4', country === selectedCountry ? 'opacity-100' : 'opacity-0')}
      />
    </CommandItem>
  )
}

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country]

  return (
    <span className="flex h-4 w-6 overflow-hidden rounded-sm bg-foreground/20 [&_svg:not([class*='size-'])]:size-full">
      {Flag && <Flag title={countryName} />}
    </span>
  )
}

export { PhoneInput }
