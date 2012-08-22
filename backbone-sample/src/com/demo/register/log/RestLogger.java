package com.demo.register.log;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang.builder.ReflectionToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.aspectj.lang.ProceedingJoinPoint;

public class RestLogger {
	
	private static final Map<Class<?>, Log> LOG_MAP = new HashMap<Class<?>, Log>();
	
	private Log getLogger(Class<?> clazz) {
		Log log = (Log) LOG_MAP.get(clazz);
		if (log == null) {
			log = LogFactory.getLog(clazz);
			LOG_MAP.put(clazz, log);
		}
		return log;
	}
	
	public Object profileMethod(ProceedingJoinPoint call) throws Throwable {
		Log log = getLogger(call.getTarget().getClass());

		if (log.isDebugEnabled()) {
			log.debug("method call: " + call.getSignature().toString());
			log.debug("method parameter: "
					+ ReflectionToStringBuilder.toString(call.getArgs(),
						ToStringStyle.SHORT_PREFIX_STYLE, true));
			try {
				Object rt = call.proceed();

				log.debug("method return: "
						+ ReflectionToStringBuilder.toString(rt,
								ToStringStyle.SHORT_PREFIX_STYLE, true));

				return rt;
			} catch (Throwable e) {
				log.error("method exception: " + e.getMessage(), e);
                throw e;
			} 
		} else {
			return call.proceed();
		}
	}

}
