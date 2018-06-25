import 'react-redux';
declare module 'react-redux' {
  // Add removed inferrable type to support connect as decorator
  // https://github.com/DefinitelyTyped/DefinitelyTyped/pull/16652
  export interface InferableComponentDecorator<TOwnProps> {
    // @ts-ignore
    <T extends Component<TOwnProps>>(component: T): T;
  }

  // overload connect interface to return built-in ClassDecorator
  // https://github.com/reactjs/react-redux/pull/541#issuecomment-269197189
  export interface Connect {
    <TStateProps = any, TDispatchProps = any, TOwnProps = any, TMergedProps = any, State = any>(
      // @ts-ignore
      mapStateToProps: MapStateToPropsParam<TStateProps, TOwnProps, State>,
      // @ts-ignore
      mapDispatchToProps?: MapDispatchToPropsParam<TDispatchProps, TOwnProps>,
      // @ts-ignore
      mergeProps?: MergeProps<TStateProps, TDispatchProps, TOwnProps, TMergedProps>,
      // @ts-ignore
      options?: Options
    ): InferableComponentDecorator<TOwnProps>;
  }
}
