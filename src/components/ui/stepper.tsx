
'use client'

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const StepperContext = React.createContext<{
  index: number
  setIndex: (index: number) => void
}>({
  index: 0,
  setIndex: () => {},
})

const Stepper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    index?: number
    onIndexChange?: (index: number) => void
  }
>(({ index: indexProp, onIndexChange, className, ...props }, ref) => {
  const [index, setIndex] = React.useState(indexProp || 0)

  React.useEffect(() => {
    if (indexProp !== undefined) {
      setIndex(indexProp)
    }
  }, [indexProp])

  const handleSetIndex = (newIndex: number) => {
    setIndex(newIndex)
    if (onIndexChange) {
      onIndexChange(newIndex)
    }
  }

  return (
    <StepperContext.Provider value={{ index, setIndex: handleSetIndex }}>
      <div
        ref={ref}
        className={cn("flex flex-col gap-2 w-full", className)}
        {...props}
      />
    </StepperContext.Provider>
  )
})
Stepper.displayName = "Stepper"

const StepContext = React.createContext<{
  index: number
  isCompleted: boolean
  isCurrent: boolean
  isNext: boolean
}>({
  index: 0,
  isCompleted: false,
  isCurrent: false,
  isNext: false,
})

const Step = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { index?: number }
>(({ index: indexProp, className, ...props }, ref) => {
  const { index: stepperIndex } = React.useContext(StepperContext)
  const [step, setStep] = React.useState<number | null>(null)
  
  const child = React.Children.toArray(props.children)[0]
  // @ts-ignore
  const childIndex = child?.props?.__prismane_stepper_step_index__

  const index = indexProp ?? childIndex ?? step
  const isCompleted = index !== null && index < stepperIndex
  const isCurrent = index !== null && index === stepperIndex
  const isNext = index !== null && index > stepperIndex

  React.useEffect(() => {
    const findStepIndex = (node: any): number | null => {
      if (!node || !node.parentElement) return null
      const parent = node.parentElement
      if (parent.dataset.steps) {
        return Array.from(parent.children).indexOf(node)
      }
      return findStepIndex(parent)
    }
    const element = document.getElementById(props.id || "")
    if (element) {
      setStep(findStepIndex(element))
    }
  }, [props.id])

  return (
    <StepContext.Provider value={{ index: index as number, isCompleted, isCurrent, isNext }}>
      <div
        ref={ref}
        data-completed={isCompleted}
        data-current={isCurrent}
        className={cn("flex gap-4 items-start", className)}
        {...props}
      />
    </StepContext.Provider>
  )
})
Step.displayName = "Step"

const StepIndicator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isCompleted, isCurrent } = React.useContext(StepContext)

  return (
    <div
      ref={ref}
      data-completed={isCompleted}
      data-current={isCurrent}
      className={cn(
        "w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-lg font-bold shrink-0",
        "data-[completed=true]:bg-primary data-[completed=true]:text-primary-foreground",
        "data-[current=true]:border-2 data-[current=true]:border-primary",
        className
      )}
      {...props}
    />
  )
})
StepIndicator.displayName = "StepIndicator"


const stepStatusVariants = cva("flex items-center justify-center", {
  variants: {},
  defaultVariants: {},
})

const StepStatus = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof stepStatusVariants> & {
      active?: React.ReactNode
      inactive?: React.ReactNode
      complete?: React.ReactNode
      incomplete?: React.ReactNode
    }
>(
  (
    {
      className,
      active,
      inactive,
      complete,
      incomplete,
      ...props
    },
    ref
  ) => {
    const { isCurrent, isCompleted } = React.useContext(StepContext)

    return (
      <div
        ref={ref}
        className={cn(stepStatusVariants(), className)}
        {...props}
      >
        {isCurrent && active}
        {!isCurrent && isCompleted && complete}
        {!isCurrent && !isCompleted && incomplete}
      </div>
    )
  }
)
StepStatus.displayName = 'StepStatus';


const StepSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div className={cn("flex-1 w-px bg-border h-full min-h-[2rem] absolute top-10 left-4 -z-10", className)} {...props} ref={ref} />
  )
})
StepSeparator.displayName = "StepSeparator"

const Box = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("flex flex-col", className)} {...props} />
})
Box.displayName = "Box"


const StepIcon = React.forwardRef<
  SVGSVGElement,
  React.SVGAttributes<SVGSVGElement>
>((props, ref) => {
    return <svg ref={ref} {...props} />
})
StepIcon.displayName = "StepIcon"

const StepNumber = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>((props, ref) => {
  const { index } = React.useContext(StepContext)
  return <span ref={ref} {...props}>{index + 1}</span>
})
StepNumber.displayName = "StepNumber"

const StepTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  return (
    <h3
      ref={ref}
      className={cn("font-semibold text-foreground text-base", className)}
      {...props}
    />
  )
})
StepTitle.displayName = "StepTitle"

const StepDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
})
StepDescription.displayName = "StepDescription"

export {
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepSeparator,
  Box,
  StepIcon,
  StepNumber,
  StepTitle,
  StepDescription
}
